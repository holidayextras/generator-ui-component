var camelCase = require('camel-case');
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
      message : 'module description'
    }, function ( answers ) {
      this.description = answers.description;
      done();
    }.bind(this));
  },
  
  configuringVariables: function () {
    this.camelName = camelCase(this.name);
  },
  
  scaffoldFolders: function(){
    this.mkdir("code/styles");
    this.mkdir("code/templates");
    this.mkdir("code/views");
    this.mkdir("dev");
    this.mkdir("scripts");
    this.mkdir("tests");
    this.mkdir("tests/unit");
    this.mkdir("tests/selenium");
  },
  
  writingPackage: function () {
    var options = {
      name: this.name,
      description: this.description
    };
    
    this._copyTemplate('package.json', options);
  },
  
  writingCodeDir: function () {
    var camelNameOptions = {name: this.camelName};
    var options = {name: this.name};
    
    var viewName = 'code/views/' + this.camelName + 'View.jsx';
    var templateName = 'code/templates/' + this.camelName + 'Template.jsx';
    
    this._copyTemplate('code/index.js', camelNameOptions);
    this._copyAndRenameTemplate('code/views/view.jsx', viewName, camelNameOptions );
    this._copyAndRenameTemplate('code/templates/template.jsx', templateName, options);
  },
  
  writingDevDir: function () {
    var indexOptions = {title: this.name};
    var exampleOptions = {name: this._capitalize(this.camelName)};

    this._copyTemplate('dev/index.html', indexOptions);
    this._copyTemplate('dev/example.jsx', exampleOptions);
  },
  
  writingScriptsDir: function () {
    this._copyTemplate('scripts/build-dev.sh');
  },
  
  writingBaseDir: function () {
    this._copyTemplate('index.js');
    this._copyTemplate('.gitignore');
    
    var readmeOptions = {
      name: this.name,
      description: this.description,
      capitalizedName: this.name[0].toUpperCase() + this.name.slice(1)
    };
    this._copyTemplate('README.md', readmeOptions);
  },
  
  installDependencies: function () {
    this.installingNPMDependencies();
  },
  
  installingPermissions: function () {
    var done = this.async();
    fs.chmod('scripts/build-dev.sh', '755', function(){
      done();
    });
  }
});