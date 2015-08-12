# generator-ui-component
A yeoman generator for HX UI Components compatible with the HX Webapp Template using React view components.

This generator will create the default files and directory structure for a HX UI Toolkit compatible view component.

If you are running the generator inside an existing npm app then the generator will default to the internal non-shared generator.

If you are running the generator outside of an existing npm app then the generator used will be the external shared one.

## Shared (External) views
The structure created for shared views looks as follows:
```
├ __tests__/
│  ├ [component-name]-test.js
├ code/
│  ├ templates/
│  │  └ [component-name]Template.jsx 
│  ├ views/
│  │  └ [component-name]View.jsx
│  └ index.js
├ index.js
```
A description of the function of each of these directories can be found at the bottom of this readme.

You can run the external generator either in an empty directory, or one with files already in. If files of the same name exist
then it will prompt you for conflict resolutions.

## Installation
Using npm you can globally install this generator:

`npm install -g [git repo]`

## Usage
The generator is built to work with Yeoman. Run the following command to install basic dependencies and set up the directory structure:

`yo ui-component`

The generator will automatically choose which template it should be building.
You will be prompted for some information, the rest is done automagically.


## Tests
To run the tests:

`npm test`

## Generated Directory breakdown
* **__tests__/**
Place any tests for the resulting view component or any sub-components in here. Tests are written with [Jest](https://facebook.github.io/jest/).

* **code/**
The code folder hold the source for the component. Because we use [Browserify](http://browserify.org/) and
[Redirectify](https://www.npmjs.com/package/redirectify) you can allow for brand specific overrides of any of
these files in this dir by creating a directory with the brand name and writing the override into a
file of the same name within this directory. See the [documentation on Redirectify](https://www.npmjs.com/package/redirectify) for more information.

    * **code/templates/**
In this folder are the template files which return [jsx](http://facebook.github.io/react/docs/jsx-in-depth.html) 
which will be built into the resulting [React](http://facebook.github.io/react/) view component.

    * **code/views/**
This directory contains the [React](http://facebook.github.io/react/) view component creation. These React view components are responsible
for returning the templates and may do some processing on the properties they are defined with.

    * **code/index.js**
This provides a quick accessor to the component so that it can be included by requiring the `code` directory as a whole.
