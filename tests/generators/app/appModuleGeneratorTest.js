var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var path = require('path');
var fs = require('fs');
var sinon = require('sinon');

describe('app-module generator', function(){

  var generatorDir = path.join( __dirname, '../../../generators/app');
  var resultDir = path.join( __dirname, './tmp');
  
  var name = "test-module";
  var camelName = "testModule";
  var capitalizedName = "TestModule";
  var description = "a test module";

  var npmInstall;
  var prompt;
  var chmod;

  before(function( done ){
    
    helpers.testDirectory(resultDir, function(err){
      if(err){ return done(err); }

      this.app = helpers.createGenerator('app-module', ['../../../../generators/app']);

      npmInstall = sinon.stub(this.app, "npmInstall").returnsThis();
      prompt = sinon.spy(this.app, "prompt");
      chmod = sinon.spy(fs, "chmod");
      
      helpers.mockPrompt(this.app, {
        name: 'app-module-' + name,
        description: description
      });

      this.app.run(function(){
        done();      
      });
    }.bind(this));
    
  });
  
  after(function(){
    npmInstall.restore();
    prompt.restore();
    chmod.restore();
  });
  
  it('can be required without throwing', function(){
    this.app = require('../../../generators/app');
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
    it('creates app folder', function(){
      assert.file(resultDir + '/app');
    });
    it('creates app/style folder', function(){
      assert.file(resultDir + '/app/style');
    });
    it('creates app/template folder', function(){
      assert.file(resultDir + '/app/template');
    });
    it('creates app/view folder', function(){
      assert.file(resultDir + '/app/view');
    });
    it('creates dev folder', function(){
      assert.file(resultDir + '/dev');
    });
    it('creates scripts folder', function(){
      assert.file(resultDir + '/scripts');
    });
    it('creates test folder', function(){
      assert.file(resultDir + '/tests');
    });
    it('creates test/unit folder', function(){
      assert.file(resultDir + '/tests/unit');
    });
    it('creates test/selenium folder', function(){
      assert.file(resultDir + '/tests/selenium');
    });
  });
  
  describe('writingPackage()', function(){
  
    var packageFile = resultDir + '/package.json';
  
    it('creates package.json file', function(){
      assert.file(packageFile);
    });
    it('sets module name', function(){
      assert.fileContent(packageFile, /\"name\": \"app\-module\-test\-module\"\,/);
    });
    it('sets description', function(){
      assert.fileContent(packageFile, new RegExp('\"description\": \"' + description + '\"\,'));
    });
  });
  
  describe('writingAppDir()', function(){
    describe('index.js', function(){
    
      var file = resultDir + '/app/index.js';
      
      it('creates index.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, "module.exports = require('./view/" + camelName + "View.jsx');");
      });
    });
    
    describe('view/view.js', function(){
    
      var file = resultDir + '/app/view/' + camelName + 'View.jsx';
      
      it('creates the view.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, "return require('./../template/" + camelName + "Template.jsx')(this.props);")
      });
    });
    
    describe('template/template.js', function(){
    
      var file = resultDir + '/app/template/' + camelName + 'Template.jsx';
      
      it('creates the template.js file', function(){
        assert.file(file);
      });
      it('correctly writes the content', function(){
        assert.fileContent(file, '<div className="app-module-' + name + '">')
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
        assert.fileContent(file, "var " + capitalizedName + " = require('../app');")
      });
      it('correctly writes the render tag', function(){
        assert.fileContent(file, "React.render(<" + capitalizedName + " />, document.body);")
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
      assert.ok(npmInstall.calledWith(['browserify', 'reactify', 'redirectify', 'react'], { 'save': true }));
    });
  });
  
  describe('installingPermissions()', function(){
    it('makes build-dev.sh executable', function(){
      assert.ok(chmod.calledWith('scripts/build-dev.sh', '755'));
    });
  });

});