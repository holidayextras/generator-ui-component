var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  promptingName: function () {
    var done = this.async();

    this.prompt({
      type: 'input',
      name: 'name',
      message: 'view name [ui-component-]',
      default: this.appname,
      validate: this._validateName,
      filter: this._filterName
    }, function (answers) {
      this.name = answers.name;
      done();
    }.bind(this));

  },

  installingNPMDependencies: function () {
    this.npmInstall(['browserify', 'reactify', 'redirectify', 'react', 'jest-cli', 'react-tools'], { 'save': true });
  },
  
  _validateName: function(input) {
    if(input.match(/^[a-zA-Z\-]+$/)) return true;
    return 'Name can only include letters and dashes (-)'
  },

  _filterName: function(input){
    return input.replace(/^ui\-component\-/, '');
  },
  
  _copyAndRenameTemplate: function(template, destination, options) {
    this.fs.copyTpl(
      this.templatePath(template),
      this.destinationPath(destination),
      options
    );
  },
  
  _copyTemplate: function(template, options) {
    this._copyAndRenameTemplate(template, template, options);
  },
  
  _capitalize: function(input){
    return input.charAt(0).toUpperCase() + input.slice(1)
  }
});