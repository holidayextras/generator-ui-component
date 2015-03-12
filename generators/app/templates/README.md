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

`var <%= capitalizedName %> = require('ui-component-<%= name %>');`

Then in your React view add the tags:

`<<%= capitalizedName %> />`

## Parameters

## Example

```
var React = require('react');
var <%= capitalizedName %> = require('ui-component-<%= name %>');

module.exports = React.createClass({
  render: function() {
    return(
      <<%= capitalizedName %> />
    );
  }
});
```

## Tests
