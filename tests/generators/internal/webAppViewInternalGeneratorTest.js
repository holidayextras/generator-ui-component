var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var path = require('path');
var sinon = require('sinon');
var rimraf = require('rimraf');
var fs = require('fs');
var findParentDir = require('find-parent-dir');

describe('webapp-view:internal generator', function () {

  var resultDir = path.join( __dirname, 'tmp');
  var name = 'test-view';
  var featureDirs = ['bar','foo','shared'];
  var camelName = "testView";
  var generatedDirectories = '/code/foo/views/';

  var npmInstall;
  var prompt;
  var __getFeatures;
  var app;
  var errorCallback;

  var findParentDirSync;

  var packageJson;

  beforeEach(function(){

    packageJson = {
      name: 'test-app'
    };
    
    errorCallback = sinon.spy();
    app = helpers.createGenerator('webapp-view:internal', ['../../../../generators/internal', '../../../../generators/base']);

    npmInstall = sinon.stub(app, 'npmInstall').returnsThis();
    prompt = sinon.spy(app, 'prompt');

    // faking up user input
    helpers.mockPrompt(app, {
      name: name,
      featureGroup: 'foo'
    });
    
    app.on('error', errorCallback);
    
    findParentDirSync = sinon.stub(findParentDir, "sync").returns(resultDir);
  });
  
  afterEach(function(done){
    findParentDirSync.restore();
    npmInstall.restore();
    prompt.restore();
    rimraf(resultDir, function () {
      done();
    });
  });

  describe('when required', function(){
    beforeEach(function(){
      app = require('../../../generators/internal/index');
    });
    afterEach(function(){
      app = null
    });
    
    it('does not throw an error', function(){
      assert.ok(app);
    });
  });
  
  describe('without package.json', function() {
    beforeEach(function () {
      findParentDirSync.returns(null); // faking no package.json
      app.run();
    });
    describe('initializing()', function () {
      it('should error', function () {
        assert.ok(errorCallback.called);
      });
    });
  });
  
  describe('without code directory', function() {
    
    beforeEach(function (done) {

      helpers.testDirectory(resultDir, function () {

        fs.writeFileSync('package.json', JSON.stringify(packageJson));
        app.run();
        done();
        
      });
    });

    describe('initializing()', function () {
      it('should error', function () {
        assert.ok(errorCallback.called);
      });
    });
  });
  
  describe('without feature directories', function(){
    
    beforeEach(function (done) {

      helpers.testDirectory(resultDir, function () {

        fs.writeFileSync('package.json', JSON.stringify(packageJson));
        fs.mkdirSync(path.join(resultDir, 'code'));
        
        app.run();
        done();

      });
    });

    describe('initializing()', function(){
      it('should error', function(){
        assert.ok(errorCallback.called);
      });
    });
  });
  
  describe('generator functions', function(){
    
    var app;
    
    beforeEach(function (done) {
      
      helpers.testDirectory(resultDir, function(){
      
        // building required directory structure for tests
        fs.mkdirSync(path.join(resultDir, 'code'));
        for(var i in featureDirs){
          fs.mkdirSync(path.join(resultDir, 'code', featureDirs[i]));
        }
        fs.mkdirSync(path.join(resultDir, 'code', 'foo', 'views'));
        
        // package.json is required in here so that we run the tests from this location
        fs.writeFileSync('package.json', JSON.stringify(packageJson));
        
        app = helpers.createGenerator('webapp-view:internal', ['../../../../generators/internal', '../../../../generators/base']);

        //stubbing out npmInstall as we don't want this running on all tests
        npmInstall = sinon.stub(app, 'npmInstall').returnsThis();
        prompt = sinon.spy(app, 'prompt');
        
        // faking up user input
        helpers.mockPrompt(app, {
          name: name,
          featureGroup: 'foo'
        });

        app.run(function(){
          done();
        });
      });
    });

    afterEach(function (done) {
      npmInstall.restore();
      prompt.restore();
      //rimraf(resultDir, function(){
        done();
      //});
    });

    describe('promptingName()', function(){
      it('prompts for a name', function(){
        assert.equal(prompt.args[0][0].name, 'name');
      });
    });

    describe('promptingFeature()', function(){
      it('prompts for a feature name', function(){
        assert.equal(prompt.args[1][0].name, 'featureGroup');
      });
      it('uses feature folders as choices', function(){
        assert.deepEqual(prompt.args[1][0].choices, featureDirs);
      });
    });

    describe('installingDependencies()', function(){
      it('installs required dependencies', function(){
        assert.ok(npmInstall.calledWith(['browserify', 'reactify', 'redirectify', 'react'], { 'save': true }));
      });
    });

    describe('scaffoldFolders()', function(){
      it('creates new view folder', function(){
        assert.file(resultDir + generatedDirectories + camelName)
      });
      it('creates styles folder', function(){
        assert.file(resultDir + generatedDirectories + camelName + '/styles');
      });
      it('creates templates folder', function(){
        assert.file(resultDir + generatedDirectories + camelName + '/templates');
      });
      it('creates views folder', function(){
        assert.file(resultDir + generatedDirectories + camelName + '/views');
      });
    });

    describe('writingCodeDir()', function(){
      describe('index.js', function(){

        var file = resultDir + generatedDirectories + camelName + '/index.js';

        it('is written to the correct place', function(){
          assert.file(file);
        });
        it('has the correct content', function(){
          assert.fileContent(file, "module.exports = require('./views/" + camelName + "View.jsx');");
        });
      });
      describe('view.js', function(){

        var file = resultDir + generatedDirectories + camelName + '/views/' + camelName + 'View.jsx';

        it('is written to the correct place', function(){
          assert.file(file);
        });
        it('has the correct content', function(){
          assert.fileContent(file, "    return require('../templates/" + camelName + "Template.jsx')(this.props);");
        });
      });
      describe('template.js', function(){

        var file = resultDir + generatedDirectories + camelName + '/templates/' + camelName + 'Template.jsx';

        it('is written to the correct place', function(){
          assert.file(file);
        });
        it('has the correct content', function(){
          assert.fileContent(file, '<div className="webapp-view-test-view">');
        });
      });
    });
  });
  
  describe('__getFeatures()', function(){
    beforeEach(function(){
      // create template folder stucture
      fs.mkdirSync(resultDir);
      fs.mkdirSync(resultDir + '/foo');
      fs.mkdirSync(resultDir + '/bar');
      fs.writeFileSync(resultDir + '/baz.txt', '');
    });
    afterEach(function(done){
      rimraf(resultDir, function(){
        done();
      });
    });
    it('returns subdirectory names from directory', function(){
      assert.deepEqual(['bar', 'foo'], app.__getFeatures(resultDir));
    });
  });
  
});