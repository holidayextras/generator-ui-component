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
        assert.equal('test-app', app._filterName('ui-component-test-app'));
      });
    });
    describe('with filtered text during string', function(){
      it('should return the complete string', function(){
        assert.equal('test-ui-component-app', app._filterName('test-ui-component-app'));
      });
    });
    describe('with filtered text at end of string', function(){
      it('should return the complete string', function(){
        assert.equal('test-app-ui-component', app._filterName('test-app-ui-component'));
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
});