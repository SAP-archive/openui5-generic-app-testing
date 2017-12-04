/*! openui5-generic-app-testing 2017-12-05 */

(function() {
    var module = {};
    module.exports = {
        docs: {
            description: "Enters a text into a field",
            synopsis: "I enter '<text>' into <controlId> [in <viewName> view]",
            examples: [ "I enter 'something' into txtField", "I enter 'hello' into txtNotesArea in Creation view", "I enter 'something \"good\"' into txtInput in Main view", "I enter '00012345689ABC' into txtProductId in Main view" ]
        },
        icon: "edit",
        regexp: /^I enter '(.+?)' into ([a-zA-Z0-9]+)( in ([a-zA-Z0-9]+) view)?$/,
        action: function(sText, sControlId, sViewPart, sViewName) {
            var that = this;
            var oWaitForOptions = {
                id: sControlId,
                actions: new that.actions.EnterText({
                    text: sText
                })
            };
            if (sViewPart) {
                oWaitForOptions.viewName = sViewName;
            }
            this.opa.waitFor(oWaitForOptions);
        }
    };
    module.exports.name = "iEnterText";
    sap.ui.define([], function() {
        return module.exports;
    });
})();