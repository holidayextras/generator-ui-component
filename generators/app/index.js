var findParentDir = require('find-parent-dir');
var generators = require('yeoman-generator');
var path = require('path');

module.exports = generators.Base.extend({

  initializing: function () {
    this.composeWith('ui-component:generate');
  }
});
