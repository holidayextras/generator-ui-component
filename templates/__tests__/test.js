/** @jsx React.DOM */

jest.dontMock('../code/views/<%= componentName %>View.jsx');

var React = require('react/addons');
var <%= componentName %> = require('../code/views/<%= componentName %>View.jsx');
var TestUtils = React.addons.TestUtils;

describe('<%= componentName %>', function() {

  it('is an element', function() {
    expect(TestUtils.isElement(<<%= componentName %> />)).toBeTruthy();
  });

});