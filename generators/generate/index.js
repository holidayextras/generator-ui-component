var fs = require('fs');
var path = require('path');

var BaseGenerator = require('../base');

module.exports = BaseGenerator.extend({
  initializing: function(){
    this.sourceRoot(path.join(__dirname, '/../../templates'));
    this.log('Building new shared view');
  },
  
  promptingShared: function () {
    this.promptingName();
  },
  
  promptingDescription: function () {
    var done = this.async();
    this.prompt({
      type    : 'input',
      name    : 'description',
      message : 'component description'
    }, function ( answers ) {
      this.description = answers.description;
      done();
    }.bind(this));
  },
  
  configuringVariables: function () {
    this.componentName = this._generateComponentName(this.name);
    this.name = this._generateName(this.name);
  },
  
  scaffoldFolders: function(){
    this.mkdir("code/templates");
    this.mkdir("code/views");
    this.mkdir("__tests__");
  },
  
  writingCodeDir: function () {
    var view = this._generateFileName(this.name + 'View' );
    var template = this._generateFileName(this.name + 'Template' );

    var componentNameOptions = {
      componentName: this.componentName,
      view: view,
      template: template
    };
    var options = {
      name: this.name
    };
    
    this._copyTemplate('code/index.js', componentNameOptions);
    this._copyAndRenameTemplate('code/views/view.jsx', 'code/views/' + view, componentNameOptions );
    this._copyAndRenameTemplate('code/templates/template.jsx', 'code/templates/' + template, options);
  },
  
  writingTests: function() {
    var view = this._generateFileName(this.name + '_component_view' );
    // Copy the test over
    this._copyAndRenameTemplate('__tests__/test.js', '__tests__/' + this._generateFolderName(this.name) + '-test.js',
      {
        view: view,
        componentName: this.componentName
      }
    );
  },
  
  writingBaseDir: function () {
    this._copyTemplate('index.js');
  },
  
  installDependencies: function () {
    this.installingNPMDependencies();
  }
});