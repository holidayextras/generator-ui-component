var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var sinon = require('sinon');

describe('ui-component generator', function(){

  var resultDir = path.join( __dirname, './tmp');
  
  var name = "test-module";
  var componentName = 'TestModuleComponent';
  var fileName = 'testModule';
  var description = "a test component";

  var npmInstall;
  var prompt;
  var chmod;

  beforeEach(function( done ){
    
    helpers.testDirectory(resultDir, function(err){
      if(err){ return done(err); }

      this.app = helpers.createGenerator('ui-component:generate', ['../../../../generators/generate']);

      npmInstall = sinon.stub(this.app, "npmInstall").returnsThis();
      prompt = sinon.spy(this.app, "prompt");
      chmod = sinon.spy(fs, "chmod");
      
      helpers.mockPrompt(this.app, {
        name: name,
        description: description
      });

      this.app.run(function(){
        done();      
      });
    }.bind(this));
    
  });
  
  afterEach(function(done){
    npmInstall.restore();
    prompt.restore();
    chmod.restore();
    rimraf(resultDir, function(){
      done();
    });
  });
  
  it('can be required without throwing', function(){
    this.app = require('../../../generators/generate/index');
  });

  describe('promptingName()', function(){
    it('prompts for a name', function(){
      assert.equal(prompt.args[0][0].name, 'name');
    });
  });
  
  describe('promptingDescription()', function(){
    it('prompts for a description', function(){
      assert.equal(prompt.args[1][0].name, 'description');
    });
  });
  
  describe('scaffoldFolders()', function(){
    it('creates code folder', function(){
      assert.file(resultDir + '/code');
    });
    it('creates code/templates folder', function(){
      assert.file(resultDir + '/code/templates');
    });
    it('creates code/views folder', function(){
      assert.file(resultDir + '/code/views');
    });
    it('creates test folder', function(){
      assert.file(resultDir + '/__tests__');
    });
  });
  
  describe('writingCodeDir()', function(){
    describe('index.js', function(){
    
      var file = resultDir + '/code/index.js';
      
      it('creates index.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, "module.exports = require('./views/" + fileName + "View.jsx');");
      });
    });
    
    describe('views/view.js', function(){
    
      var file = resultDir + '/code/views/' + fileName + 'View.jsx';
      
      it('creates the view.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, "module.exports = React.createClass({\n  render: function() {\n    return require('../templates/testModuleTemplate.jsx')(this);\n  }\n});")
      });
    });
    
    describe('templates/template.js', function(){
    
      var file = resultDir + '/code/templates/' + fileName + 'Template.jsx';
      
      it('creates the template.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, '<div className="component-' + name + '">')
      });
    });
  });
  
  describe('writingMainIndexFile()', function(){
    it('creates index.js file', function(){
      assert.file(resultDir + '/index.js');
    });
  });
  
  describe('installingDependencies()', function(){
    it('calls npm install', function(){
      assert.ok(npmInstall.calledWith(['browserify', 'reactify', 'redirectify', 'react', 'jest-cli', 'react-tools'], { 'save': true }));
    });
  });

});