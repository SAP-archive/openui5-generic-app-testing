/* global module */

module.exports = function(grunt) {

    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "uglify": {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n",
                beautify: true,
                compress: false,
                mangle: false,
                output: {
                    comments: 'all',
                    quoteStyle: 'double'
                }
            },
            steps: {
                files: [{
                    expand: true,
                    cwd: "dist/steps/",
                    src: "*.js",
                    dest: "dist/steps/"
                }]
            }
        },
        "copy": {
            main: {
                files: [
                    { expand: true, flatten: true, src: "src/GenericSteps.js", dest: "dist/"}
                ]
            },
            steps: {
                src: ["*.js"],
                cwd: "src/steps",
                dest: "dist/steps",
                expand: true,
                options: {
                    process: function (content, srcpath) {
                        if (content.indexOf("module.exports") === -1) {
                            return content;
                        }

                        function getJsFileName(sPath) {
                            return sPath
                                .split("/")
                                .filter(x => x.match(/[.]js$/))[0].replace(".js", "");
                        }
                        
                        var sHeader = `
                            /* global sap */
                            (function () { var module = {};

                            /* --- */
                        `;
                        var sFooter = `
                            /* --- */

                            module.exports.name = "${getJsFileName(srcpath)}";

                            sap.ui.define([], function () {
                                return module.exports;
                            });

                            }());
                        `;

                        return sHeader + content + sFooter;
                    }
                }
            }
        },
        "clean": {
            erase: ["./dist/"]
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");


    // Default task(s).
    grunt.registerTask("default", ["clean", "copy:steps", "copy:main", "uglify"]);
};
