var camelCase = require('camel-case');
var findParentDir = require('find-parent-dir');
var fs = require('fs');
var generators = require('yeoman-generator');
var path = require('path');

module.exports = generators.Base.extend({
  initializing: function () {
    this.sourceRoot(path.join(__dirname, '/../../templates'));
    
    this.options.baseDir = findParentDir.sync(path.resolve(''), 'package.json');
    
    var projectPackageJson = require(this.options.baseDir + '/package.json');
    this.log('Building view within project ' + projectPackageJson.name);
  },
  promptingName: function () {
    var done = this.async();

    this.prompt({
      type: 'input',
      name: 'name',
      message: 'view name [webapp-view-]',
      default: this.appname
    }, function (answers) {
      this.options.name = answers.name.replace(/^webapp\-view\-/, '');
      this.options.camelName = camelCase(this.options.name);
      done();
    }.bind(this));

  },
  promptingFeature: function () {
    var done = this.async();

    this.prompt({
      type: 'list',
      name: 'featureGroup',
      message: 'Which feature group should this be part of?',
      choices: this.__getFeatures(path.join(this.options.baseDir,'code')),
      default: 'shared'
    }, function (answers) {
      this.options.viewRoot = path.join('code', answers.featureGroup, 'views', this.options.camelName);
      done();
    }.bind(this));

  },
  installingDependencies: function () {
    this.npmInstall(['browserify', 'reactify', 'redirectify', 'react'], {'save': true});
  },
  scaffoldFolders: function () {
    this.mkdir(this.options.viewRoot + '/styles');
    this.mkdir(this.options.viewRoot + '/templates');
    this.mkdir(this.options.viewRoot + '/views');
  },
  writingCodeDir: function () {
    this.fs.copyTpl(
      this.templatePath('code/index.js'),
      this.destinationPath(this.options.viewRoot + '/index.js'),
      {name: this.options.camelName}
    );
    this.fs.copyTpl(
      this.templatePath('code/views/view.jsx'),
      this.destinationPath(this.options.viewRoot + '/views/' + this.options.camelName + 'View.jsx'),
      {name: this.options.camelName}
    );
    this.fs.copyTpl(
      this.templatePath('code/templates/template.jsx'),
      this.destinationPath(this.options.viewRoot + '/templates/' + this.options.camelName + 'Template.jsx'),
      {name: this.options.name}
    );
  },
  __getFeatures: function (rootDir) {
    return fs.readdirSync(rootDir).filter(function(file) {
      return fs.statSync(path.join(rootDir, file)).isDirectory();
    });
  }
});