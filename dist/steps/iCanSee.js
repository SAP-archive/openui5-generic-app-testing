/*! openui5-generic-app-testing 2017-12-05 */

(function() {
    var module = {};
    module.exports = {
        docs: {
            description: "Tests whether an element is visible in a certain view",
            synopsis: "I can see (CONTROL_ID | the [POS] [CONTROL_TYPE] control (deeply|directly) nested inside CONTROL_ID) [with PROPERTY 'TEXT'] [in VIEW_NAME view]",
            examples: [ "I can see btnNext", "I can see btnNext with text 'next' in Detail view", "I can see lblTitle in Overview view", "I can see txtInput with value '1234ABCD' in Main view", "I can see txtInput with value containing '123' in Main view", "I can see txtInput with value containing '123'", "I can see the 21st sap.m.Button control deeply nested inside grpButtons with text 'Apples' in Main view", "I can see the sap.m.Button control deeply nested inside grpButtons" ]
        },
        icon: "show",
        regexp: new RegExp([ "^I can see\\s+", "(", "(the( first| last| \\d+?st| \\d+?rd| \\d+?th| \\d+?nd)?( ([a-zA-Z]+[.])+[a-zA-Z]+)? control\\s(deeply|directly) nested inside ([a-zA-Z0-9]+))|", "([a-zA-Z0-9]+)", ")", "(\\swith\\s([^\\s]+)\\s(containing\\s|starting\\swith\\s|ending\\swith\\s)?'(.+?)')?", "(\\s+in\\s+(.+?)\\sview)?\\s*$" ].join("")),
        action: function(sControlIdentifier, sWholeNestedExpression, sMaybePosition, sControlType, sControlPrefix, sDeeplyOrDirectly, sParentControlId, sControlId, sWithProperty, sPropertyName, sTypeOfCheck, sValue, sViewPart, sViewName) {
            var that = this;
            var oWaitForOptions = {
                id: sWholeNestedExpression ? sParentControlId : sControlId,
                success: function(oControl) {
                    var sInView = sViewName ? " in " + sViewName + " view" : "";
                    if (sWholeNestedExpression) {
                        var oSearch = that.utils.findControl(sMaybePosition, sControlType, sWithProperty, sPropertyName, sTypeOfCheck, sValue, sDeeplyOrDirectly, oControl);
                        that.Opa5.assert.ok(!!oSearch.found, sWholeNestedExpression + " " + sWithProperty + " was found" + sInView);
                        return;
                    }
                    if (sWithProperty) {
                        var oMatch = that.utils.testControlProperty(oControl, sPropertyName, sTypeOfCheck, sValue);
                        var sPossibleFailReason = oMatch.success ? "" : " ERROR: " + oMatch.reason;
                        that.Opa5.assert.ok(oMatch.success, [ sControlId, "with", sPropertyName, sTypeOfCheck + "'" + sValue + "'", "was found" + sInView + sPossibleFailReason ].join(" "));
                        return;
                    }
                    that.Opa5.assert.ok(true, [ sControlId, "was found" + sInView ].join(" "));
                }
            };
            if (sViewName) {
                oWaitForOptions.viewName = sViewName;
            }
            that.opa.waitFor(oWaitForOptions);
        }
    };
    module.exports.name = "iCanSee";
    sap.ui.define([], function() {
        return module.exports;
    });
})();