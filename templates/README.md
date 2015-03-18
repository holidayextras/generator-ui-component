# ui-component-<%= name %>
<%= description %>

## Installation
To install this module:

`npm install [git repo]`

## Development
To build the dev site run:

`npm run build-dev`

## Usage
In the javascript file you wish to use it in:

`var <%= componentName %> = require('ui-component-<%= name %>');`

Then in your React view add the tags:

`<<%= componentName %> />`

## Building a distributable version
To build a distributable version of the component:

`npm run build-dist`

Note this will *not* bundle React. It will assume that's in scope to use in your project already.

## Running the tests
Once generated, you can run a components tests with:

`npm test`

Tests are written using [Jest](https://facebook.github.io/jest/).

## Parameters

## Example

```
var React = require('react');
var <%= componentName %> = require('ui-component-<%= name %>');

module.exports = React.createClass({
  render: function() {
    return(
      <<%= componentName %> />
    );
  }
});
```