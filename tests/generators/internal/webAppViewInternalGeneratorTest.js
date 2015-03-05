var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var path = require('path');
var sinon = require('sinon');
var rimraf = require('rimraf');
var fs = require('fs');

describe('webapp-view:internal generator', function () {

  var resultDir = path.join( __dirname, 'tmp');
  var name = 'test-view';
  var featureDirs = ['foo','bar','shared'];
  var camelName = "testView";
  var generatedDirectories = '/code/shared/views/';

  var npmInstall;
  var prompt;
  var __getFeatures;

  it('can be required without throwing', function(){
    this.app = require('../../../generators/internal/index');
  });
  
  describe('generator functions', function(){
    beforeEach(function (done) {
      helpers.testDirectory(resultDir, function (err) {
        if(err){ return done(err); }

        this.app = helpers.createGenerator('webapp-view:internal', ['../../../../generators/internal']);

        npmInstall = sinon.stub(this.app, 'npmInstall').returnsThis();
        prompt = sinon.spy(this.app, 'prompt');
        __getFeatures = sinon.stub(this.app, '__getFeatures').returns(featureDirs);
        helpers.mockPrompt(this.app, {
          name: 'webapp-view-' + name,
          featureGroup: 'shared'
        });

        this.app.run(function(){
          done();
        });

      }.bind(this));
    });

    afterEach(function (done) {
      npmInstall.restore();
      prompt.restore();
      __getFeatures.restore();
      rimraf(resultDir, function(){
        done();
      });
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
        assert.equal(prompt.args[1][0].choices, featureDirs);
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
    var app;
    beforeEach(function(){
      // create template folder stucture
      fs.mkdirSync(resultDir);
      fs.mkdirSync(resultDir + '/foo');
      fs.mkdirSync(resultDir + '/bar');
      fs.writeFileSync(resultDir + '/baz.txt', '');
      this.app = helpers.createGenerator('webapp-view:internal', ['../../../../generators/internal']);
    });
    afterEach(function(done){
      rimraf(resultDir, function(){
        done();
      });
    });
    it('returns subdirectory names from directory', function(){
      assert.deepEqual(['bar', 'foo'], this.app.__getFeatures(resultDir));
    });
  });
});