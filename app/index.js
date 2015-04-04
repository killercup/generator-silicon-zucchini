'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var NAME = "SiliconZucchini";

function copyFiles(file) {
  var action = file.tmpl ? 'copyTpl' : 'copy';

  this.fs[action](
    this.templatePath(file.from),
    this.destinationPath(file.to || file.from),
    file.tmpl ? this.data : null
  );
}

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fantabulous ' + chalk.green(NAME) + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname // Default to current folder name
      },
      {
        type: 'confirm',
        name: 'scss_goodies',
        message: 'Would you like some SCSS goodies (bourbon, neat, opentype)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'styleguide',
        message: 'May I include an automatic styleguide?',
        default: true
      },
      {
        type: 'confirm',
        name: 'posts',
        message: 'Shall I add an example for news/blog posts?',
        default: false
      }
    ];

    this.prompt(prompts, function (props) {
      this.data = props;
      done();
    }.bind(this));
  },

  writing: {
    meta: function () {
      [
        {from: '_package.json', to: 'package.json', tmpl: true},
        {from: '_editorconfig', to: '.editorconfig'},
        {from: '_eslintrc', to: '.eslintrc'}
      ]
      .forEach(copyFiles.bind(this));
    },

    buildProcess: function () {
      [
        {from: 'Gulpfile.js', tmpl: true},
        {from: 'zucchini-settings.js', tmpl: true}
      ]
      .forEach(copyFiles.bind(this));
    },

    projectFiles: function () {
      [
        {from: 'data/pages/start.cson', tmpl: true},
        {from: 'data/pages/subpage.md', tmpl: true},
        {from: 'src/index.scss', tmpl: true},

        {from: 'src/schemas/navigation.cson'},
        {from: 'src/schemas/page.cson'},
        {from: 'src/molecules/nav-main-elements.html'},
        {from: 'src/organisms/nav-main.html'},
        {from: 'src/organisms/nav-main.scss'},
        {from: 'src/templates/_head.html'},
        {from: 'src/templates/_tail.html'},
        {from: 'src/templates/page.html'}
      ]
      .forEach(copyFiles.bind(this));
    },

    styleguideFiles: function () {
      if (!this.data.styleguide) { return; }

      [
        {from: 'src/templates/styleguide.html'}
      ]
      .forEach(copyFiles.bind(this));
    },

    postsFiles: function () {
      if (!this.data.posts) { return; }

      [
        {from: 'data/posts/2015-01-01-happy-new-year.md'},
        {from: 'src/templates/articles.html'},
        {from: 'src/templates/article.html'},
        {from: 'src/schemas/article.cson'}
      ]
      .forEach(copyFiles.bind(this));
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      bower: false
    });
  },

  end: function () {
    this.log(chalk.green('All done.'));
    this.log('');
    this.log(chalk.underline.green('Usage:'));
    this.log('- You can start a development server using `npm start`.');
    this.log('- You can compile your site for production using ' +
      '`npm run compile`.');
  }
});
