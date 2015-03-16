var findParentDir = require('find-parent-dir');
var generators = require('yeoman-generator');
var path = require('path');

module.exports = generators.Base.extend({

  initializing: function () {
    if( findParentDir.sync(path.resolve(''), 'package.json') ) {
      this.composeWith('webapp-view:internal');
    } else {
      this.composeWith('webapp-view:external');
    }
  }
});
