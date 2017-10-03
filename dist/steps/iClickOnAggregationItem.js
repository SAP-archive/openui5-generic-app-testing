/*! openui5-generic-app-testing 2017-10-04 */

(function() {
    var module = {};
    module.exports = {
        docs: {
            description: "Performs a click on a specific item of a control collection (e.g., a list)",
            synopsis: "I click on <position> item of <controlId> <collectionName> [in <viewName> view]",
            examples: [ "I click on first item of leaveRequestTableA items in Overview view", "I click on 2nd item of leaveRequestTableB items in Overview view", "I click on last item of leaveRequestTableC items in Main view", "I click on last item of lstObjects items" ]
        },
        icon: "cursor-arrow",
        regexp: new RegExp([ "^I click on (first|last|\\d+st|\\d+rd|\\d+th|\\d+nd) item of", "\\s+([a-zA-Z0-9]+?)", "\\s([a-zA-Z0-9]+?)", "(\\sin (.+?) view)?$" ].join("")),
        action: function(sItemPosition, sControlId, sAggregationName, sViewPart, sViewName) {
            var that = this;
            var oWaitForOptions = {
                id: sControlId,
                success: function(oControl) {
                    var aItems = oControl.getAggregation(sAggregationName), iItemIndex = that.utils.positionTextToIndex(sItemPosition, aItems.length), oItem = aItems[iItemIndex];
                    oItem.$().trigger("tap");
                }
            };
            if (sViewPart) {
                oWaitForOptions.viewName = sViewName;
            }
            this.opa.waitFor(oWaitForOptions);
        }
    };
    module.exports.name = "iClickOnAggregationItem";
    sap.ui.define([], function() {
        return module.exports;
    });
})();