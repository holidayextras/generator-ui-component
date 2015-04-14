/** @jsx React.DOM */

jest.dontMock('../code/views/<%= view %>');

var React = require('react/addons');
var <%= componentName %> = require('../code/views/<%= view %>');
var TestUtils = React.addons.TestUtils;

describe('<%= componentName %>', function() {

  it('is an element', function() {
    expect(TestUtils.isElement(<<%= componentName %> />)).toBeTruthy();
  });

});