/* global module */

module.exports = function(grunt) {

    function convertCommonJsFileToWebModule (content, srcpath) {
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
            (function () {
                "use strict";
                var module = {};

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

        return sHeader + content.replace(/"use strict";?/g, "") + sFooter;
    }

    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "uglify": {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n",
                beautify: true,
                compress: false,
                mangle: false,
                output: {
                    comments: "all",
                    quoteStyle: "double"
                }
            },
            all: {
                files: [
                    {
                        expand: true,
                        cwd: "dist/steps/",
                        src: "*.js",
                        dest: "dist/steps/"
                    },
                    {
                        expand: true,
                        cwd: "dist/",
                        src: "*.js",
                        dest: "dist/"
                    }
                ]
            }
        },
        "copy": {
            main: {
                files: [
                    { expand: true, flatten: true, src: "src/GenericSteps.js", dest: "dist/"}
                ]
            },
            utils: {
                src: ["utils.js"],
                cwd: "src",
                dest: "dist",
                expand: true,
                options: {
                    process: convertCommonJsFileToWebModule
                }
            },
            steps: {
                src: ["*.js"],
                cwd: "src/steps",
                dest: "dist/steps",
                expand: true,
                options: {
                    process: convertCommonJsFileToWebModule
                }
            }
        },
        "clean": {
            erase: ["./dist/"]
        },
        "eslint": {
            target: ["src/"],
            options: {
                configFile: ".eslintrc",
                globals: ["module", "sap"]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-eslint");


    // Default task(s).
    grunt.registerTask("default", ["clean", "eslint", "copy:steps", "copy:utils", "copy:main", "uglify"]);
};
