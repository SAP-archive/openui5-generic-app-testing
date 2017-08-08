/*! openui5-generic-app-testing 2017-08-09 */

(function() {
    var module = {};
    module.exports = {
        docs: {
            description: "Starts the app",
            synopsis: "I start the app from '<pathToHtmlOrComponentId>'",
            examples: [ "I start the app from 'ui5app/test/ui5app.html'", "I start the app from 'sap.ui.sample.appUnderTest'", "I start the app from 'namespace.appUnderTest'", "I start the app from '//host:1234/path/to/index.html'", "I start the app from 'http://host:1234/path/to/index.html'", "I start the app from '/absolute/path/to/index.html'" ]
        },
        icon: "begin",
        regexp: /^I start the app from '((([a-zA-Z][a-zA-Z0-9]*[.])*[a-zA-Z][a-zA-Z0-9]*)|(.+[.]html))'$/,
        action: function(sPathOrComponent) {
            if (sPathOrComponent.match(/[.]html$/)) {
                if (sPathOrComponent.indexOf("http") === 0 || sPathOrComponent.indexOf("/") === 0 || sPathOrComponent.indexOf("//") === 0) {
                    this.opa.iStartMyAppInAFrame(sPathOrComponent);
                    return;
                }
                this.opa.iStartMyAppInAFrame(this.sap.getResourcePath(sPathOrComponent.replace(/[.]html$/, ""), ".html"));
                return;
            }
            this.opa.iStartMyUIComponent({
                componentConfig: {
                    name: sPathOrComponent
                },
                hash: ""
            });
        }
    };
    module.exports.name = "iStartTheApp";
    sap.ui.define([], function() {
        return module.exports;
    });
})();