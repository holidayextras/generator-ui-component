var React = require('react');

module.exports = React.createClass({
  render: function() {
    return require('../templates/<%= componentName %>Template.jsx')(this.props);
  }
});