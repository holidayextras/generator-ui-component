var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('webapp-view:base generator', function () {
  var app;
  
  beforeEach(function(){
    app = helpers.createGenerator('webapp-view:base', [ './generators/base']);
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
        assert.equal('test-app', app._filterName('webapp-view-test-app'));
      });
    });
    describe('with filtered text during string', function(){
      it('should return the complete string', function(){
        assert.equal('test-webapp-view-app', app._filterName('test-webapp-view-app'));
      });
    });
    describe('with filtered text at end of string', function(){
      it('should return the complete string', function(){
        assert.equal('test-app-webapp-view', app._filterName('test-app-webapp-view'));
      });
    });
    describe('without filtered text in string', function(){
      it('should return the complete string', function(){
        assert.equal('test-app', app._filterName('test-app'));
      });
    });
    describe('with filtered text as entire string', function(){
      it('should return string', function(){
        assert.equal('webapp-view', app._filterName('webapp-view'));
      });
    });
  });
});