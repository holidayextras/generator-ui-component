var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var sinon = require('sinon');

describe('ui-component:external generator', function(){

  var resultDir = path.join( __dirname, './tmp');
  
  var name = "test-module";
  var componentName = 'TestModuleComponent';
  var description = "a test component";

  var npmInstall;
  var prompt;
  var chmod;

  beforeEach(function( done ){
    
    helpers.testDirectory(resultDir, function(err){
      if(err){ return done(err); }

      this.app = helpers.createGenerator('ui-component:external', ['../../../../generators/external']);

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
    this.app = require('../../../generators/external/index');
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
    it('creates code/styles folder', function(){
      assert.file(resultDir + '/code/styles');
    });
    it('creates code/templates folder', function(){
      assert.file(resultDir + '/code/templates');
    });
    it('creates code/views folder', function(){
      assert.file(resultDir + '/code/views');
    });
    it('creates dev folder', function(){
      assert.file(resultDir + '/dev');
    });
    it('creates scripts folder', function(){
      assert.file(resultDir + '/scripts');
    });
    it('creates test folder', function(){
      assert.file(resultDir + '/__tests__');
    });
  });
  
  describe('writingPackage()', function(){
  
    var packageFile = resultDir + '/package.json';
  
    it('creates package.json file', function(){
      assert.file(packageFile);
    });
    it('sets component name', function(){
      assert.fileContent(packageFile, /\"name\": \"ui\-component\-test\-module\"\,/);
    });
    it('sets description', function(){
      assert.fileContent(packageFile, new RegExp('\"description\": \"' + description + '\"\,'));
    });
  });
  
  describe('writingCodeDir()', function(){
    describe('index.js', function(){
    
      var file = resultDir + '/code/index.js';
      
      it('creates index.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, "module.exports = require('./views/" + componentName + "View.jsx');");
      });
    });
    
    describe('views/view.js', function(){
    
      var file = resultDir + '/code/views/' + componentName + 'View.jsx';
      
      it('creates the view.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, "return require('../templates/" + componentName + "Template.jsx')(this.props);")
      });
    });
    
    describe('templates/template.js', function(){
    
      var file = resultDir + '/code/templates/' + componentName + 'Template.jsx';
      
      it('creates the template.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, '<div className="ui-component-' + name + '">')
      });
    });
  });
  
  describe('writingDevDir()', function(){
    describe('index.html', function(){
      it('creates index.html file', function(){
        assert.file( resultDir + '/dev/index.html');
      });
    });
    
    describe('example.jsx', function(){
      
      var file = resultDir + '/dev/example.jsx';
    
      it('creates example.jsx file', function(){
        assert.file(file);
      });
      it('correctly writes the require statement', function(){
        assert.fileContent(file, "var " + componentName + " = require('../code');")
      });
      it('correctly writes the render tag', function(){
        assert.fileContent(file, "React.render(<" + componentName + " />, document.body);")
      });
    });
  });
  
  describe('writingScriptsDir()', function(){
    it('creates build-dev.sh file', function(){
      assert.file(resultDir + '/scripts/build-dev.sh');
    });
  });
  
  describe('writingMainIndexFile()', function(){
    it('creates index.js file', function(){
      assert.file(resultDir + '/index.js');
    });
  });
  
  describe('writingGitIgnore()', function(){
    it('creates .gitignore file', function(){
      assert.file(resultDir + '/.gitignore');
    });
  });
  
  describe('writingReadMe()', function(){
    var file = resultDir + '/README.md';
    it('creates README.md file', function(){
      assert.file(file);
    });
  });
  
  describe('installingDependencies()', function(){
    it('calls npm install', function(){
      assert.ok(npmInstall.calledWith(['browserify', 'reactify', 'redirectify', 'react', 'jest-cli', 'react-tools'], { 'save': true }));
    });
  });
  
  describe('installingPermissions()', function(){
    it('makes build-dev.sh executable', function(){
      assert.ok(chmod.calledWith('scripts/build-dev.sh', '755'));
    });
  });

});