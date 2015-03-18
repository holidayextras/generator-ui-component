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
      message : 'component description'
    }, function ( answers ) {
      this.description = answers.description;
      done();
    }.bind(this));
  },
  
  configuringVariables: function () {
    this.camelName = camelCase(this.name);
    this.componentName = this._capitalize(this.camelName) + "Component";
  },
  
  scaffoldFolders: function(){
    this.mkdir("code/styles");
    this.mkdir("code/templates");
    this.mkdir("code/views");
    this.mkdir("dev");
    this.mkdir("dist");
    this.mkdir("scripts");
    this.mkdir("__tests__");
  },
  
  writingPackage: function () {
    var options = {
      name: this.name,
      description: this.description
    };
    
    this._copyTemplate('package.json', options);
  },
  
  writingCodeDir: function () {
    var componentNameOptions = {componentName: this.componentName};
    var options = {name: this.name};
    
    var viewName = 'code/views/' + this.componentName + 'View.jsx';
    var templateName = 'code/templates/' + this.componentName + 'Template.jsx';
    
    this._copyTemplate('code/index.js', componentNameOptions);
    this._copyAndRenameTemplate('code/views/view.jsx', viewName, componentNameOptions );
    this._copyAndRenameTemplate('code/templates/template.jsx', templateName, options);
  },
  
  writingDevDir: function () {
    var indexOptions = {name: this.name};
    var exampleOptions = {componentName: this.componentName};

    this._copyTemplate('dev/index.html', indexOptions);
    this._copyTemplate('dev/example.jsx', exampleOptions);
  },
  
  writingDistDir: function () {
    this.fs.copy(
      this.templatePath('dist/.gitkeep'),
      this.destinationPath('dist/.gitkeep')
    );
  },
  
  writingScriptsDir: function () {
    var options = {name: this.name};
    this._copyTemplate('scripts/build-dev.sh', options);
    this._copyTemplate('scripts/build-dist.sh', options);
  },
  
  writingTests: function() {
    // Copy the test over
    this._copyAndRenameTemplate('__tests__/test.js', '__tests__/' + this.componentName + '-test.js',
      {componentName: this.componentName}
    );

    // Copy the preprocessor over
    this._copyTemplate('preprocessor.js');
  },
  
  writingBaseDir: function () {
    this._copyTemplate('index.js');
    this._copyTemplate('.gitignore');
    
    var readmeOptions = {
      name: this.name,
      description: this.description,
      componentName: this.componentName
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