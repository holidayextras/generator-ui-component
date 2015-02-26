var React = require('react');

module.exports = React.createClass({
  render: function() {
    return require('./../template/<%= name %>Template.jsx')(this.props);
  }
});