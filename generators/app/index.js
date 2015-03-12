var generators = require('yeoman-generator');
var camelCase = require('camel-case');
var fs = require('fs');

module.exports = generators.Base.extend({
  promptingName: function () {
    var done = this.async();
    this.prompt({
      type    : 'input',
      name    : 'name',
      message : 'view name [ui-component-]',
      default : this.appname
    }, function ( answers ) {
      this.options.name = answers.name.replace(/^ui\-component\-/, '');
      this.options.camelName = camelCase(this.options.name);
      this.options.componentName = this.options.camelName.charAt(0).toUpperCase() + this.options.camelName.slice(1) + "Component";
      done();
    }.bind(this));
  },
  promptingDescription: function () {
    var done = this.async();
    this.prompt({
      type    : 'input',
      name    : 'description',
      message : 'module description'
    }, function ( answers ) {
      this.options.description = answers.description;
      done();
    }.bind(this));
  },
  scaffoldFolders: function(){
    this.mkdir("code");
    this.mkdir("code/styles");
    this.mkdir("code/templates");
    this.mkdir("code/views");
    this.mkdir("dev");
    this.mkdir("dist");
    this.mkdir("scripts");
    this.mkdir("__tests__");
  },
  writingPackage: function () {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        name: this.options.name,
        description: this.options.description
      }
    );
  },
  writingCodeDir: function () {
    this.fs.copyTpl(
      this.templatePath('code/index.js'),
      this.destinationPath('code/index.js'),
      {
        componentName: this.options.componentName
      }
    );
    this.fs.copyTpl(
      this.templatePath('code/views/view.jsx'),
      this.destinationPath('code/views/' + this.options.componentName + '.jsx'),
      {
        componentName: this.options.componentName
      }
    );
    this.fs.copyTpl(
      this.templatePath('code/templates/template.jsx'),
      this.destinationPath('code/templates/' + this.options.componentName + 'Template.jsx'),
      {
        name: this.options.name
      }
    );
  },
  writingDevDir: function () {
    this.fs.copyTpl(
      this.templatePath('dev/index.html'),
      this.destinationPath('dev/index.html'),
      {
        name: this.options.name
      }
    );
    this.fs.copyTpl(
      this.templatePath('dev/example.jsx'),
      this.destinationPath('dev/example.jsx'),
      {
        componentName: this.options.componentName
      }
    );
  },
  writingDistDir: function () {
    this.fs.copy(
      this.templatePath('dist/.gitkeep'),
      this.destinationPath('dist/.gitkeep')
    );
  },
  writingScriptsDir: function () {
    this.fs.copyTpl(
      this.templatePath('scripts/build-dev.sh'),
      this.destinationPath('scripts/build-dev.sh'),
      {
        name: this.options.name
      }
    );
    this.fs.copyTpl(
      this.templatePath('scripts/build-dist.sh'),
      this.destinationPath('scripts/build-dist.sh'),
      {
        name: this.options.name
      }
    );
  },
  writingTests: function() {
    // Copy the test over
    this.fs.copyTpl(
      this.templatePath('__tests__/test.js'),
      this.destinationPath('__tests__/' +  this.options.componentName + '-test.js'),
      {
        componentName: this.options.componentName
      }
    );

    // Copy the preprocessor over
    this.fs.copy(
      this.templatePath('preprocessor.js'),
      this.destinationPath('preprocessor.js')
    );
  },
  writingMainIndexFile: function () {
    this.fs.copy(
      this.templatePath('index.js'),
      this.destinationPath('index.js')
    );
  },
  writingGitIgnore: function () {
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );
  },
  writingReadMe: function () {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        name: this.options.name,
        description: this.options.description,
        componentName: this.options.componentName
      }
    );
  },
  installingDependencies: function () {
    this.npmInstall(['browserify', 'reactify', 'redirectify', 'react', 'jest-cli', 'react-tools'], { 'save': true });
  },
  installingPermissions: function () {
    var done = this.async();
    fs.chmod('scripts/build-dev.sh', '755', function(){
      done();
    });
  }
});