var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
  promptingName: function () {
    var done = this.async();

    this.prompt({
      type: 'input',
      name: 'name',
      message: 'view name [component-]',
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
    if(input.match(/^[a-z\_]+$/)) return true;
    return 'Name can only include letters a-z (lowercase) and underscores (_)';
  },

  _filterName: function(input){
    return input.replace(/^component\-/, '');
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
    return input.charAt(0).toUpperCase() + input.slice(1);
  },
  
  _generateComponentName: function(input) {
    // Effectively this is pascal casing as lodash doesn't have that yet.
    return _.capitalize(_.camelCase(input) + 'Component');
  },

  _generateFolderName: function(input) {
    return _.snakeCase(input);
  },

  _generateFileName: function(input, ext) {
    if(!input) return '';
    return [_.camelCase(input), (ext || 'jsx')].join('.')
  },

  _generateName: function(input) {
    return _.kebabCase(input);
  }
});