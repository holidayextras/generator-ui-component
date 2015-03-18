# generator-ui-component
A yeoman generator for HX UI Components compatible with the HX Webapp Template using React view components.

This generator will create the default files and directory structure for a HX UI Toolkit compatible view component.

If you are running the generator inside an existing npm app then the generator will default to the internal non-shared generator.

If you are running the generator outside of an existing npm app then the generator used will be the external shared one.

## Shared (External) views
The structure created for shared views looks as follows:
```
├ code/
│  ├ styles/
│  ├ templates/
│  │  └ [module-name]ComponentTemplate.jsx 
│  ├ views/
│  │  └ [module-name]Component.jsx
│  └ index.js
├ dev/
│  ├ example.jsx
│  └ index.html
├ scripts/
│  └ build-dev.sh
├ tests/
│  ├ unit/
│  └ selenium/
├ .gitignore
├ index.js
├ package.json
└ README.md
```
A description of the function of each of these directories can be found at the bottom of this readme.

You can run the external generator either in an empty directory, or one with files already in. If files of the same name exist
then it will prompt you for conflict resolutions.

### Non-Shared (Internal) views

For the non-shared views it creates the following directory structure in either a named feature or the shared features folders:

```
(./code/products/views/)
├ [module-name]/
│  ├ styles/
│  ├ templates/
│  │  └ [module-name]Template.jsx 
│  ├ views/
│  │  └ [module-name]View.jsx
│  └ index.js
```

## Installation
Using npm you can globally install this generator:

`npm install -g [git repo]`

## Usage
The generator is built to work with Yeoman. Run the following command to install basic dependencies and set up the directory structure:

`yo ui-component`

The generator will automatically choose which template it should be building.
You will be prompted for some information, the rest is done automagically.

If you would like to specifically run the internal generator you can specify:

`yo webapp-view:internal`

Alternatively if you'd like to run the external generator you can specify:

`yo webapp-view:external`

## Tests
To run the tests:

`npm test`

## Generated Directory breakdown
* **__tests__/**
Place any tests for the resulting view component or any sub-components in here. Tests are written with [Jest](https://facebook.github.io/jest/).

* **code/**
The code folder hold the source for the module. Because we use [Browserify](http://browserify.org/) and
[Redirectify](https://www.npmjs.com/package/redirectify) you can allow for brand specific overrides of any of
these files in this dir by creating a directory with the brand name and writing the override into a
file of the same name within this directory. See the [documentation on Redirectify](https://www.npmjs.com/package/redirectify) for more information.

    * **code/styles/**
This is the home off `.less` files to provide feature specific styles which is intended only to make the current feature
display correctly. For instance, you shouldn't be styling the colour of a button specific to a brand, but if a brand
requires the button to be displayed in a different place or with a different `display` style.

    * **code/templates/**
In this folder are the template files which return [jsx](http://facebook.github.io/react/docs/jsx-in-depth.html) 
which will be built into the resulting [React](http://facebook.github.io/react/) view component.

    * **code/views/**
This directory contains the [React](http://facebook.github.io/react/) view component creation. These React view components are responsible
for returning the templates and may do some processing on the properties they are defined with.

    * **code/index.js**
This provides a quick accessor to the component so that it can be included by requiring the `code` directory as a whole.

* **dev/**
This is the home of the development environment for the module. When you run `npm run build-dev`
[Browserify](http://browserify.org/) bundles from the `example.jsx` file which includes the modules root directory
(`./generators/app`). Loading the `index.html` in your browser will display the module.


* **scripts/**
In here is the `build-dev.sh` script which runs [Browserify](http://browserify.org/) on the `dev/example.jsx` file.
You can specify a variant brand to build by specifying `VARIANT=[brand-name] npm run build-dev`.

