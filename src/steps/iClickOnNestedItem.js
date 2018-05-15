module.exports = {
    docs: {
        description: "Performs a click on a control of a certain type nested inside a control with a known id",
        synopsis: "I click on the [POS] [CONTROL_TYPE] control (deeply|directly) nested inside CONTROL_ID [with PROPERTY 'TEXT'] [in VIEW_NAME view]",
        examples: [
            "I click on the control directly nested inside grpButtons",
            "I click on the first control deeply nested inside grpButtons with text containing 'hi'",
            "I click on the sap.m.Button control deeply nested inside grpButtons",
            "I click on the 3rd sap.m.Button control deeply nested inside grpButtons with text 'Oranges'",
            "I click on the first sap.m.GenericTile control directly nested inside grpButtons",
            "I click on the 21st sap.m.Button control deeply nested inside grpButtons with text 'Apples' in Main view"
        ]
    },
    icon: "cursor-arrow",
    regexp: new RegExp([
        "^I click on (the( first| last| \\d+?st| \\d+?rd| \\d+?th| \\d+?nd)?( ([a-zA-Z]+[.])+[a-zA-Z]+)? control"
        , "\\s(deeply|directly) nested inside ([a-zA-Z0-9]+)"
        , "\\s?(with\\s([^\\s]+)\\s(containing\\s|starting\\swith\\s|ending\\swith\\s)?'(.+?)')?"    // [with <property> '<string>']
        , "(\\sin (.+?) view)?)"
        , "$"
    ].join("")),
    action: function (
        sDescriptiveMatch, // e.g., "the 23rd sap.m.Text ... in Main View"
        sMaybePosition,    // e.g., " 23rd"
        sControlType,      // e.g., " sap.m.Text"
        sControlPrefix,    // e.g., "sap.m."
        sDeeplyOrDirectly, // e.g., "deeply|directly"
        sControlId,        // e.g., "btnExecute"
        sWithProperty,     // e.g., "with text containing 'hello'"
        sPropertyName,     // e.g., "text"
        sTypeOfCheck,      // e.g., "containing "
        sValue,            // e.g., "hello"
        sViewPart,         // e.g., " in Main view"
        sViewName          // e.g., "Main"
    ) {
        "use strict";

        var that = this;

        var oWaitForOptions = {
            id: sControlId,
            success: function (oParentControl) {

                var oSearch = that.utils.findControl(
                    sMaybePosition,
                    sControlType,
                    sWithProperty,
                    sPropertyName,
                    sTypeOfCheck,
                    sValue,
                    sDeeplyOrDirectly,
                    oParentControl
                );

                that.Opa5.assert.ok(!!oSearch.found, sDescriptiveMatch + " found");

                oSearch.found.$().trigger("tap");
            }
        };

        if (sViewPart) {
            oWaitForOptions.viewName = sViewName;
        }

        this.opa.waitFor(oWaitForOptions);
    }
};
