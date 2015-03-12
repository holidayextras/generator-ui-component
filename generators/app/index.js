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
      this.options.name = answers.name.replace(/^webapp\-view\-/, '');
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
    this.mkdir("code");
    this.mkdir("code/styles");
    this.mkdir("code/templates");
    this.mkdir("code/views");
    this.mkdir("dev");
    this.mkdir("dist");
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
  writingCodeDir: function () {
    this.fs.copyTpl(
      this.templatePath('code/index.js'),
      this.destinationPath('code/index.js'),
      {name: this.options.camelName}
    );
    this.fs.copyTpl(
      this.templatePath('code/views/view.jsx'),
      this.destinationPath('code/views/' + this.options.camelName + 'View.jsx'),
      {name: this.options.camelName}
    );
    this.fs.copyTpl(
      this.templatePath('code/templates/template.jsx'),
      this.destinationPath('code/templates/' + this.options.camelName + 'Template.jsx'),
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
  writingDistDir: function () {
    this.fs.copy(
      this.templatePath('dist/.gitkeep'),
      this.destinationPath('dist/.gitkeep')
    );
  },
  writingScriptsDir: function () {
    this.fs.copy(
      this.templatePath('scripts/build-dev.sh'),
      this.destinationPath('scripts/build-dev.sh')
    );
    this.fs.copyTpl(
      this.templatePath('scripts/build-dist.sh'),
      this.destinationPath('scripts/build-dist.sh'),
      {
        name: this.options.name
      }
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