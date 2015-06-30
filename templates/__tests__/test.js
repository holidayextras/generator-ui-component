/** @jsx React.DOM */
var React = require('react');
var <%= componentName %> = require('../code/views/<%= view %>.jsx');

describe('<%= componentName %>', function() {

  it('is an element', function() {
    assert.ok(TestUtils.isElement(<<%= componentName %> />));
  });

});