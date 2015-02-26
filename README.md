# generator-app-module
Generator for HX app modules using React views.

This generator will create the default files and directory structure for a shared module for the modularised HX app.

The structure created looks as follows:
```
├ app/
│  ├ style/
│  ├ template/
│  │  └ [module-name]Template.jsx 
│  ├ view/
│  │  └ [module-name]View.jsx
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

You can run this generator either in an empty directory, or one with files already in. If files of the same name exist
then it will prompt you for conflict resolutions.

## Installation
Using npm you can globally install this generator:

`npm install -g [git repo]`

## Usage
The generator is built to work with Yeoman. Run the following command to install basic dependencies and set up the directory structure:

`yo app-module`

You will be prompted for some information, the rest is done automagically.

## Tests
To run the tests:

`npm test`

## Generated Directory breakdown
* **app/**
The app folder hold the source for the module. Because we use [Browserify](http://browserify.org/) and 
[Redirectify](https://www.npmjs.com/package/redirectify) you can allow for brand specific overrides of any of 
these files in this dir by creating a directory with the brand name and writing the override into a
file of the same name within this directory. See the 
[documentation on Redirectify](https://www.npmjs.com/package/redirectify) for more information.

    * **app/style/**
This is the home off `.less` files to provide feature specific styles which is intended only to make the current feature
display correctly. For instance, you shouldn't be styling the colour of a button specific to a brand, but if a brand
requires the button to be displayed in a different place or with a different `display` style.

    * **app/template/**
In this folder are the template files which return [jsx](http://facebook.github.io/react/docs/jsx-in-depth.html) 
which will be built into [React](http://facebook.github.io/react/) views.

    * **app/view/**
This directory contains the [React](http://facebook.github.io/react/) view creation. These React views are responsible
for returning the templates and may do some processing on the properties they are defined with.

    * **app/index.js**
This provides a quick accessor to the view so that it can be included by requiring the `app` directory as a whole.

* **dev/**
This is the home of the development environment for the module. When you run `npm run build-dev` 
[Browserify](http://browserify.org/) bundles from the `example.jsx` file which includes the modules root directory
(`./generators/app`). Loading the `index.html` in your browser will display the module.


* **scripts/**
In here is the `build-dev.sh` script which runs [Browserify](http://browserify.org/) on the `dev/example.jsx` file.
You can specify a variant brand to build by specifying `VARIANT=[brand-name] npm run build-dev`.


* **tests/**
Place any tests for the module in here.