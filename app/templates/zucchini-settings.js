var path = require('path');
var l = require('lodash');
<% if (posts) { %>var slug = require('slug');
<% }%>
var SiliconZucchini = require('silicon-zucchini');
var S = SiliconZucchini.Helpers;

/**
 * Zucchini Settings
 */

/**
 * ## Settings
 */

var ZUCCHINI_SETTINGS = {
  data: './data/**/*.{json,cson,md}',
  schemas: './src/schemas/**/*.{json,cson}',
  templates: './src/**/*.html',
  styles: ["src/index.scss", "src/**/*.scss"],
  destination: 'build',

  processData: setDataDefaults,
  createRoutes: createRoutes,

  templateHelpers: {
    l: l,
    S: require('underscore.string')
  }
};

/**
 * ## Functions
 */

function setDataDefaults(dataStream) {
  return dataStream
  <% if (posts) { %>.pipe(S.dataDefaults('^posts/', {
    schema: {$ref: '#post'},
    slug: function (a) {
      return slug(a.data.title).toLowerCase();
    }
  }))<% } %>
  .pipe(S.dataDefaults('^pages/', {
    schema: {$ref: '#page'},
    permalink: function (p) {
      return S.stripFileExt(p.relative).replace(/^pages/, '');
    }
  }))
  <% if (posts) { %>.pipe(S.uniqFields(['slug'], '^posts/'))<% } %>
  .pipe(S.uniqFields(['permalink'], '^pages/'))
  ;
}

function createRoutes(data, schemas, getTemplate) {
  return [
    <% if (posts) { %>{
      data: {title: "Articles", articles: S.filterByPath('^posts/', data)},
      route: 'artikel',
      layout: getTemplate('templates/articles.html')
    },
    S.filterByPath('^posts/', data).map(function (article) {
      return {
        data: article.data,
        route: path.join('artikel', article.data.slug),
        layout: getTemplate(
          article.data.layout ? 'templates/' + article.data.layout + '.html' :
          'templates/article.html'
        )
      };
    }),<% } %>
    S.filterByPath('^pages/', data).map(function (page) {
      return {
        data: page.data,
        route: page.data.permalink,
        layout: getTemplate(
          page.data.layout ? 'templates/' + page.data.layout + '.html' :
          'templates/page.html'
        )
      };
    })
  ];
}

module.exports = ZUCCHINI_SETTINGS;
