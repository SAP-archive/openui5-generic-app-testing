module.exports = {
    docs: {
        description: "Performs a click on a specific item in a control aggregation (e.g., a list)",
        synopsis: "I click on POS item of CONTROL_ID AGGREGATION_NAME [in VIEW_NAME view]",
        examples: [
            "I click on first item of leaveRequestTableA items in Overview view",
            "I click on 2nd item of leaveRequestTableB items in Overview view",
            "I click on last item of leaveRequestTableC items in Main view",
            "I click on last item of lstObjects items"
        ]
    },
    icon: "cursor-arrow",
    regexp: new RegExp([
        "^I click on (first|last|\\d+st|\\d+rd|\\d+th|\\d+nd) item of"
        , "\\s+([a-zA-Z0-9]+?)"  // control name
        , "\\s([a-zA-Z0-9]+?)"   // aggregation name
        , "(\\sin (.+?) view)?$"
    ].join("")),
    action: function (sItemPosition, sControlId, sAggregationName, sViewPart, sViewName) {
        var that = this;
        var oWaitForOptions = {
            id: sControlId,
            success: function (oControl) {
                var aItems = oControl.getAggregation(sAggregationName),
                    iItemIndex = that.utils.positionTextToIndex(sItemPosition, aItems.length),
                    oItem = aItems[iItemIndex];

                oItem.$().trigger("tap");
            }
        };

        if (sViewPart) {
            oWaitForOptions.viewName = sViewName;
        }

        this.opa.waitFor(oWaitForOptions);
    }
};
