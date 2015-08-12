module.exports = React.createClass({
  render: function() {
    return require('../templates/<%= template %>')(this);
  }
});