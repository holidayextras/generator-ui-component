var assert = require('yeoman-generator').assert;
var findParentDir = require('find-parent-dir');
var helpers = require('yeoman-generator').test;
var sinon = require('sinon');

describe('webapp-view generator', function(){
  
  var composeWith;
  var findParentDirSync;

  beforeEach(function(){
    this.app = helpers.createGenerator('webapp-view', ['./generators/app']);
    composeWith = sinon.stub(this.app, 'composeWith');
  });
  
  afterEach(function(){
    composeWith.restore();
  });

  describe('when in find-parent-dir returns directories', function(){
    beforeEach(function(done){
      findParentDirSync = sinon.stub(findParentDir, 'sync').returns(['foo', 'bar']);
      this.app.run(function () {
        done();
      });
    });
    
    afterEach(function(){
      findParentDirSync.restore();
    });
    
    it('uses the internal generator', function(){
      assert.ok(composeWith.calledWith('webapp-view:internal'));
    });
  });

  describe('when find-parent-dir returns no directories', function(){
    beforeEach(function(done){
      findParentDirSync = sinon.stub(findParentDir, 'sync').returns(null);
      this.app.run(function () {
        done();
      });
    });

    afterEach(function(){
      findParentDirSync.restore();
    });

    it('uses the external generator', function(){
      assert.ok(composeWith.calledWith('webapp-view:external'));
    });
  });
  
});