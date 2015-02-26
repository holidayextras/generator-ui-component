var generators = require('yeoman-generator');
var camelCase = require('camel-case');
var fs = require('fs');

module.exports = generators.Base.extend({
  promptingName: function () {
    var done = this.async();
    this.prompt({
      type    : 'input',
      name    : 'name',
      message : 'module name [app-module-]',
      default : this.appname
    }, function ( answers ) {
      this.options.name = answers.name.replace(/^app\-module\-/, '');
      this.options.camelName = camelCase(this.options.name);
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
    this.mkdir("app");
    this.mkdir("app/style");
    this.mkdir("app/template");
    this.mkdir("app/view");
    this.mkdir("dev");
    this.mkdir("scripts");
    this.mkdir("tests");
    this.mkdir("tests/unit");
    this.mkdir("tests/selenium");
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
  writingAppDir: function () {
    this.fs.copyTpl(
      this.templatePath('app/index.js'),
      this.destinationPath('app/index.js'),
      {name: this.options.camelName}
    );
    this.fs.copyTpl(
      this.templatePath('app/view/view.jsx'),
      this.destinationPath('app/view/' + this.options.camelName + 'View.jsx'),
      {name: this.options.camelName}
    );
    this.fs.copyTpl(
      this.templatePath('app/template/template.jsx'),
      this.destinationPath('app/template/' + this.options.camelName + 'Template.jsx'),
      {name: this.options.name}
    );
  },
  writingDevDir: function () {
    this.fs.copyTpl(
      this.templatePath('dev/index.html'),
      this.destinationPath('dev/index.html'),
      {title: this.options.name}
    );
    this.fs.copyTpl(
      this.templatePath('dev/example.jsx'),
      this.destinationPath('dev/example.jsx'),
      {name: this.options.camelName.charAt(0).toUpperCase() + this.options.camelName.slice(1)}
    );
  },
  writingScriptsDir: function () {
    this.fs.copy(
      this.templatePath('scripts/build-dev.sh'),
      this.destinationPath('scripts/build-dev.sh')
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
        capitalizedName: this.options.name[0].toUpperCase() + this.options.name.slice(1)
      }
    );
  },
  installingDependencies: function () {
    this.npmInstall(['browserify', 'reactify', 'redirectify', 'react'], { 'save': true });
  },
  installingPermissions: function () {
    var done = this.async();
    fs.chmod('scripts/build-dev.sh', '755', function(){
      done();
    });
  }
});