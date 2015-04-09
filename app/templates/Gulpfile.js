/**
 * ## Build Tasks
 */

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');

var SiliconZucchini = require('silicon-zucchini');
var INPUTS = require('./zucchini-settings').inputs;
var SETTINGS = require('./zucchini-settings').settings;

function getInputs(skipData) {
  return {
    data: skipData ? null : INPUTS.getData(SETTINGS.data),
    templates: INPUTS.getTemplates(SETTINGS.templates),
    schemas: INPUTS.getSchemas(SETTINGS.schemas)
  };
}

/**
 * ## Compile Steps
 */

function clean(cb) {
  del(SETTINGS.destination, cb);
}

function site() {
  return SiliconZucchini.compile(getInputs(), SETTINGS);
}
<% if (styleguide) { %>
function styleguide() {
  return SiliconZucchini.styleguide(getInputs(true), SETTINGS);
}<% } %>

function styles() {
  return gulp.src(SETTINGS.styles)
  .pipe(sourcemaps.init())
  .pipe(concat('style.scss'))
  .pipe(sass({
    <% if (scss_goodies) { %>includePaths: [
      'node_modules/bourbon/app/assets/stylesheets',
      'node_modules/bourbon-neat/app/assets/stylesheets',
      'node_modules/normalize-opentype.css'
    ]<% } %>
  }))
  .pipe(autoprefixer());
}

/**
 * ## Work
 */

function build() {
  return site()
  .pipe(gulp.dest(SETTINGS.destination))
  .pipe(connect.reload());
}

function buildStyles() {
  return styles()
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(SETTINGS.destination))
  .pipe(connect.reload());
}

function buildStyleguide() {
  return styleguide()
  .pipe(gulp.dest(SETTINGS.destination))
  .pipe(connect.reload());
}

function watch() {
  gulp.watch(
    [
      SETTINGS.data,
      SETTINGS.schemas,
      SETTINGS.templates
    ],
    gulp.parallel(build<% if (styleguide) { %>, styleguide<% } %>)
  );

  gulp.watch(
    SETTINGS.styles,
    buildStyles
  );
}

function serve() {
  connect.server({
    root: SETTINGS.destination,
    livereload: true
  });
}

function compile() {
  return gulp.series(
    function compileStyles() {
      return styles()
      .pipe(require('gulp-minify-css')())
      .pipe(require('gulp-rev')())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(SETTINGS.destination))
      .pipe(require('gulp-rev').manifest())
      .pipe(gulp.dest(SETTINGS.destination))
      ;
    },
    function compileSite() {
      return require('multipipe')(
        build()<% if (styleguide) { %>,
        buildStyleguide()<% } %>
      )
      .pipe(require('gulp-minify-html')())
      .pipe(require("gulp-rev-replace")({
        manifest: gulp.src(SETTINGS.destination + "/rev-manifest.json")
      }))
      .pipe(gulp.dest(SETTINGS.destination))
      ;
    }
  );
}

/**
 * ## Tasks
 */

gulp.task('build', gulp.series(
  clean,
  gulp.parallel(build, buildStyles)
));
<% if (styleguide) { %>
gulp.task('styleguide', gulp.series(
  clean,
  gulp.parallel(styleguide, buildStyles)
));<% } %>

gulp.task('default', gulp.series(
  clean,
  gulp.parallel(build<% if (styleguide) { %>, buildStyleguide<% } %>, buildStyles)
));

gulp.task('watch', gulp.series(
  clean,
  gulp.parallel(build<% if (styleguide) { %>, buildStyleguide<% } %>),
  watch
));

gulp.task('serve', gulp.parallel('default', serve, watch));

gulp.task('compile', gulp.series(
  clean,
  compile()
));
