var React = require('react');

module.exports = React.createClass({
  render: function() {
    return require('../templates/<%= name %>Template.jsx')(this.props);
  }
});