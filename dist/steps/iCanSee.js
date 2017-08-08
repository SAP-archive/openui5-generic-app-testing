/*! openui5-generic-app-testing 2017-08-09 */

(function() {
    var module = {};
    module.exports = {
        docs: {
            description: "Tests whether an element is visible in a certain view",
            synopsis: "I can see <id> [with <property> '<text>'] [in <viewName> view]",
            examples: [ "I can see btnNext", "I can see btnNext with text 'next' in Detail view", "I can see lblTitle in Overview view", "I can see txtInput with value '1234ABCD' in Main view", "I can see txtInput with value containing '123' in Main view", "I can see txtInput with value containing '123'" ]
        },
        icon: "show",
        regexp: new RegExp([ "^I can see\\s+", "([a-zA-Z0-9]+)", "\\s?(with\\s([^\\s]+)\\s(containing\\s|starting\\swith\\s|ending\\swith\\s)?'(.+?)')?", "(\\s+in\\s+(.+?)\\sview)?\\s*$" ].join("")),
        action: function(sId, sWithProperty, sPropertyName, sTypeOfCheck, sValue, sViewPart, sViewName) {
            var that = this;
            var oWaitForOptions = {
                id: sId,
                success: onControlObtained
            };
            if (sViewName) {
                oWaitForOptions.viewName = sViewName;
            }
            that.opa.waitFor(oWaitForOptions);
            function onControlObtained(oControl) {
                if (sWithProperty) {
                    var sGetterMethodName = "get" + sPropertyName.charAt(0).toUpperCase() + sPropertyName.slice(1);
                    if (typeof oControl[sGetterMethodName] !== "function") {
                        throw new Error("Your iCanSee action specifies '" + sWithProperty + "'. However the control '" + sId + "' does not expose the " + sGetterMethodName + " getter");
                    }
                    var sText = oControl[sGetterMethodName]();
                    if (sTypeOfCheck === "containing ") {
                        that.Opa5.assert.ok(sText.indexOf(sValue) >= 0, [ sId, "with " + sPropertyName, "containing '" + sValue + "'", "was found in", sViewName, "view" ].join(" "));
                        return;
                    }
                    if (sTypeOfCheck === "starting with ") {
                        that.Opa5.assert.ok(sText.indexOf(sValue) === 0, [ sId, "with " + sPropertyName, "starting with '" + sValue + "'", "was found in", sViewName, "view" ].join(" "));
                        return;
                    }
                    if (sTypeOfCheck === "ending with ") {
                        var iPosition = sText.indexOf(sValue);
                        if (iPosition === -1) {
                            that.Opa5.assert.ok(false, [ sId, "with " + sPropertyName, "does not end with '" + sValue + "'", "in", sViewName, "view" ].join(" "));
                            return;
                        }
                        that.Opa5.assert.ok(iPosition + sValue.length === sText.length, [ sId, "with " + sPropertyName, "ending with '" + sValue + "'", "was found in", sViewName, "view" ].join(" "));
                        return;
                    }
                    that.Opa5.assert.strictEqual(sText, sValue, [ sId, "with " + sPropertyName, "'" + sValue + "'", "was found in", sViewName, "view" ].join(" "));
                    return;
                }
                that.Opa5.assert.ok(true, [ sId, "was found in", sViewName, "view" ].join(" "));
            }
        }
    };
    module.exports.name = "iCanSee";
    sap.ui.define([], function() {
        return module.exports;
    });
})();