var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ui-component:base generator', function () {
  var app;
  
  beforeEach(function(){
    app = helpers.createGenerator('ui-component:base', [ './generators/base']);
  });
  describe('_validateName()', function(){
    describe('with valid name', function(){
      it('returns true', function(){
        assert.ok(app._validateName('foo-bar'));
      });
    });
    describe('with invalid name', function(){
      it('returns an error message', function(){
        assert.equal(typeof app._validateName('12345'), 'string');
      });
    });
  });

  describe('_filterName()', function(){
    describe('with filtered text at start', function(){
      it('should remove the filtered text', function(){
        assert.equal('test-app', app._filterName('component-test-app'));
      });
    });
    describe('with filtered text during string', function(){
      it('should return the complete string', function(){
        assert.equal('test-component-app', app._filterName('test-component-app'));
      });
    });
    describe('with filtered text at end of string', function(){
      it('should return the complete string', function(){
        assert.equal('test-app-component', app._filterName('test-app-component'));
      });
    });
    describe('without filtered text in string', function(){
      it('should return the complete string', function(){
        assert.equal('test-app', app._filterName('test-app'));
      });
    });
    describe('with filtered text as entire string', function(){
      it('should return string', function(){
        assert.equal('ui-component', app._filterName('ui-component'));
      });
    });
  });
  describe( '_generateFolderName()', function() {
    describe('no input', function() {
      it('should return an empty string', function() {
        assert.strictEqual('', app._generateFolderName())
      });
    });
    describe('mixed casing', function() {
      it('should return a snakecase string', function() {
        assert.strictEqual('f_oo_ba_r', app._generateFolderName('fOoBaR'))
      });
    });
    describe('hyphens in the string', function() {
      it('should return a snakecase string where hyphens are replaced with underscores', function() {
        assert.strictEqual('foo_bar_baz', app._generateFolderName('foo-bar--baz'))
      });
    });
  });
  describe( '_generateComponentName()', function() {
    describe('no input', function() {
      it('should return "Component"', function() {
        assert.strictEqual('Component', app._generateComponentName())
      });
    });
    describe('mixed casing', function() {
      it('should return a string with the correct pascal casing & \"Component\" appended', function() {
        assert.strictEqual('FOoBaRComponent', app._generateComponentName('fOoBaR'))
      });
    });
    describe('hyphens in the string', function() {
      it('should return a string with the correct pascal casing & \"Component\" appended', function() {
        assert.strictEqual('FooBarBazComponent', app._generateComponentName('foo-bar--baz'))
      });
    });
  });
  describe( '_generateFileName()', function() {
    describe('no input', function() {
      it('should return an empty string', function() {
        assert.strictEqual('', app._generateFileName())
      });
    });
    describe('without an extension', function() {
      it('should return the input string with .jsx appended', function() {
        assert.strictEqual('foobar.jsx', app._generateFileName('foobar'))
      });
    });
    describe('with an extension', function() {
      it('should return the input string with the extension appended', function() {
        assert.strictEqual('foobar.baz', app._generateFileName('foobar','baz'))
      });
    });
    describe('mixed casing', function() {
      it('should return a camel case string with .jsx appended', function() {
        assert.strictEqual('fOoBaR.jsx', app._generateFileName('fOoBaR'))
      });
    });
    describe('hyphens in the string', function() {
      it('should return a camel case string with .jsx appended', function() {
        assert.strictEqual('fooBarBaz.jsx', app._generateFileName('foo-bar--baz'))
      });
    });
  });
  describe( '_generateName()', function() {
    describe('no input', function() {
      it('should return an empty string', function() {
        assert.strictEqual('', app._generateName())
      });
    });
    describe('mixed casing', function() {
      it('should return a lowercase string "kebab case"', function() {
        assert.strictEqual('f-oo-ba-r', app._generateName('fOoBaR'))
      });
    });
    describe('underscores in the string', function() {
      it('should return a lowercase string with hyphens in place of underscores "kebab case"', function() {
        assert.strictEqual('foo-bar-baz', app._generateName('foo_bar__baz'))
      });
    });
  });
});