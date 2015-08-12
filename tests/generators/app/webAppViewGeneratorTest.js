var assert = require('yeoman-generator').assert;
var findParentDir = require('find-parent-dir');
var helpers = require('yeoman-generator').test;
var sinon = require('sinon');

describe('ui-component generator', function(){
  
  var composeWith;
  var findParentDirSync;

  beforeEach(function(){
    this.app = helpers.createGenerator('ui-component', ['./generators/app']);
    composeWith = sinon.stub(this.app, 'composeWith');
  });
  
  afterEach(function(){
    composeWith.restore();
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

    it('uses the component generator', function(){
      assert.ok(composeWith.calledWith('ui-component:generate'));
    });
  });
  
});