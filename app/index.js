"use strict";
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
	constructor: function(){
		yeoman.generators.Base.apply(this, arguments);
		this.log("n3r generator begin...plz wait..");
		this.config.set("author", "shuwei");
		this.config.set("version", "0.0.1");
	},
	promptTask: function(){
		var done = this.async();
		this.prompt({
			type: "input",
			name: "name",
			message: "input your project name:",
			default: this.appname
		}, function(answers){
			this.log("will create project:" + answers.name);
			this.appname = answers.name;
			done();
		}.bind(this));
	},
	createDir: function(){
		this.mkdir("app");
        this.mkdir("app/styles");
        this.mkdir("app/styles_less");
        this.mkdir("app/scripts");
        this.mkdir("app/scripts/example");
        this.mkdir("app/scripts/example/controllers");
        this.mkdir("app/scripts/example/directives");
        this.mkdir("app/scripts/example/services");
        this.mkdir("app/views");
	},
	copyFiles: function(){
		//base project files
		this.copy("_Gruntfile.js", "Gruntfile.js");
		this.copy("_.bowerrc", ".bowerrc");
		this.copy("_.jshintrc", ".jshintrc");

		//init project files
		this.copy("styles_less/_main.less", "app/styles_less/main.less");
		this.copy("scripts/_config.js", "app/scripts/config.js");
		this.copy("scripts/_main.js", "app/scripts/main.js");
		this.copy("scripts/example/_example.js", "app/scripts/example/controllers/example.js");
		this.copy("scripts/example/_main.js", "app/scripts/example/main.js");
	},
	projectPlaceholder: function(){
		var context = {"appname" : this.appname, "currentVersion": this.config.get("version")};
		this.template("_package.json", "package.json", context);
		this.template("_index.html", "app/index.html", context);
		this.template("_bower.json", "bower.json", context);
	},
	runNpm: function(){
        var done = this.async();
        this.npmInstall("", function(){
            console.log("\n安装成功!!!嘻嘻\n");
            done();
        });
    }
});