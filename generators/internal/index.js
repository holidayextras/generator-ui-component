var camelCase = require('camel-case');
var findParentDir = require('find-parent-dir');
var fs = require('fs');
var generators = require('yeoman-generator');
var path = require('path');
var _ = {
  union: require('amp-union')
};

module.exports = generators.Base.extend({
  initializing: function () {
    var done = this.async();
    this.sourceRoot(path.join(__dirname, '/../../templates'));
    
    this.options.baseDir = findParentDir.sync(__dirname, 'package.json');
    if(!this.options.baseDir){
      this.env.error('Cannot use internal generator outside of an existing project');
    }

    var projectPackageJson = require(this.options.baseDir + '/package.json');
    this.log('Building view within project ' + projectPackageJson.name);

    if(!fs.existsSync(path.join(this.options.baseDir, 'code'))){
      this.env.error('Current project is not in expected format (no code/ directory in project root ' + this.options.baseDir + ')');
    }

    this.featureDirectories = this.__getFeatures(path.join(this.options.baseDir,'code'));
    if(!this.featureDirectories || this.featureDirectories.length === 0){
      this.env.error('No feature directories were found');
    }
    
    done();
  },
  promptingName: function () {
    var done = this.async();

    this.prompt({
      type: 'input',
      name: 'name',
      message: 'view name [webapp-view-]',
      default: this.appname,
      validate: this.__validateName,
      filter: this.__filterName
    }, function (answers) {
      this.options.name = answers.name;
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
      choices: this.featureDirectories
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
  },
  
  __validateName: function(input) {
    if(input.match(/^[a-zA-Z\-]+$/)) return true;
    return 'Name can only include letters and dashes (-)'
  },
  
  __filterName: function(input){
    return input.replace(/^webapp\-view\-/, '');
  }
});