module.exports = {
    docs: {
        description: "Tests whether an element is visible in a certain view",
        synopsis: "I can see <id> [with <property> '<text>'] [in <viewName> view]",
        examples: [
            "I can see btnNext",
            "I can see btnNext with text 'next' in Detail view",
            "I can see lblTitle in Overview view",
            "I can see txtInput with value '1234ABCD' in Main view",
            "I can see txtInput with value containing '123' in Main view",
            "I can see txtInput with value containing '123'"
        ]
    },
    icon: "show",
    regexp: new RegExp(["^I can see\\s+"
        , "([a-zA-Z0-9]+)"              // <id>
        , "\\s?(with\\s([^\\s]+)\\s(containing\\s|starting\\swith\\s|ending\\swith\\s)?'(.+?)')?"    // [with <property> '<string>']
        , "(\\s+in\\s+(.+?)\\sview)?\\s*$" // in <viewName> view
    ].join("")),
    action: function (sId, sWithProperty, sPropertyName, sTypeOfCheck, sValue, sViewPart, sViewName) {
        var that = this,
            oWaitForOptions;

        oWaitForOptions = {
            id: sId,
            success: onControlObtained
        };

        if (sViewName) {
            oWaitForOptions.viewName = sViewName;
        }

        that.opa.waitFor(oWaitForOptions);

        function onControlObtained (oControl) {
            var bTextValueCheckPass,
                sText,
                sInView,
                sGetterMethodName;

            sInView = sViewName
                ? " in " + sViewName + " view"
                : "";

            if (sWithProperty) {
                sGetterMethodName = that.utils.getGetterMethodName(sPropertyName);
                if (typeof oControl[sGetterMethodName] !== "function") {
                    throw new Error(
                        "Your iCanSee action specifies '" + sWithProperty + "'. However the control '" + sId + "' does not expose the " + sGetterMethodName + " getter"
                    );
                }

                sText = oControl[sGetterMethodName]();

                sTypeOfCheck = (sTypeOfCheck || "equal to").replace(/\s+$/g, "");

                bTextValueCheckPass = that.utils.testTextValue(sTypeOfCheck, sText, sValue);
                that.Opa5.assert.ok(bTextValueCheckPass, [
                    sId, "with", sPropertyName, sTypeOfCheck + "'" + sValue + "'",
                    "was found" + sInView
                ]);

                return;
            }

            that.Opa5.assert.ok(true, [sId, "was found" + sInView].join(" "));
        }
    }
};
