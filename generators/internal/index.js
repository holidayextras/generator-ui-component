var camelCase = require('camel-case');
var findParentDir = require('find-parent-dir');
var fs = require('fs');
var path = require('path');

var BaseGenerator = require('../base');

module.exports = BaseGenerator.extend({
  initializing: function () {
    var done = this.async();

    this.sourceRoot(path.join(this.sourceRoot(), '/../../../templates/code'));

    this.baseDir = findParentDir.sync(this.destinationRoot(), 'package.json');
    if(!this.baseDir){
      this.env.error('Cannot use internal generator outside of an existing project');
    }

    var projectPackageJson = require(this.baseDir + '/package.json');
    this.log('Building view within project ' + projectPackageJson.name);

    if(!fs.existsSync(path.join(this.baseDir, 'code'))){
      this.env.error('Current project is not in expected format (no code/ directory in project root ' + this.baseDir + ')');
    }

    this.featureDirectories = this.__getFeatures(path.join(this.baseDir,'code'));
    if(!this.featureDirectories || this.featureDirectories.length === 0){
      this.env.error('No feature directories were found');
    }

    done();
  },
  
  prompting: function () {
    this.promptingName();
  },
  
  promptingFeature: function () {
    var done = this.async();

    this.prompt({
      type: 'list',
      name: 'featureGroup',
      message: 'Which feature group should this be part of?',
      choices: this.featureDirectories
    }, function (answers) {
      this.featureGroup = answers.featureGroup;
      done();
    }.bind(this));

  },
  
  configuringVariables: function() {
    this.camelName = camelCase(this.name);
    this.viewRoot = path.join('code', this.featureGroup, 'views', this.camelName);
  },
  
  installingDependencies: function () {
    this.installingNPMDependencies();
  },
  
  scaffoldFolders: function () {
    this.mkdir(this.viewRoot + '/styles');
    this.mkdir(this.viewRoot + '/templates');
    this.mkdir(this.viewRoot + '/views');
  },
  
  writingCodeDir: function () {
    var camelNameOptions = {name: this.camelName};
    var viewPath = path.join(this.viewRoot, 'views', this.camelName + 'View.jsx');
    var templatePath = path.join(this.viewRoot, 'templates', this.camelName + 'Template.jsx');
    
    this._copyAndRenameTemplate('index.js', this.viewRoot + '/index.js', camelNameOptions);
    this._copyAndRenameTemplate('views/view.jsx', viewPath, camelNameOptions);
    this._copyAndRenameTemplate('templates/template.jsx', templatePath, {name: this.name});
  },

  __getFeatures: function (rootDir) {
    return fs.readdirSync(rootDir).filter(function(file) {
      return fs.statSync(path.join(rootDir, file)).isDirectory();
    });
  }
});