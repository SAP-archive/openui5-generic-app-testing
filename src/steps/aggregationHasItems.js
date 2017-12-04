module.exports = {
    docs: {
        description: "Tests whether a specific control aggregation contains items",
        synopsis: "<controlId> [in <viewName> view] contains [number || 'no'] <aggregationName>",
        examples: [
            "lstShapes contains 10 items",
            "lstShapes contains no items",
            "lstShapes contains items",
            "lstShapes in Main view contains items",
            "lstCities in Overview view contains 31 items",
            "lstCities in Detail view contains 0 items",
            "lstCities in Overview view contains no items",
        ]
    },
    icon: "group-2",
    regexp: new RegExp([
        "^([^\\s]+?)"               // id
        ,"( in ([^\\s]+?) view)?"   // view name
        ," contains(\\sno|\\s\\d+)?(\\s[^\\s]+)$" /* contains no items
                                                   * contains items
                                                   * contains 1 items
                                                   */
    ].join("")),
    action: function (sId, sViewPart, sViewName, sNumber, sAggregationName) {
        var sMessage,
            iNumber,
            oMatcher,
            sAggregationNameNoSpaces,
            that = this;

        iNumber = null;
        if (sNumber) {
            iNumber = parseInt(sNumber, 0) || 0;
        }

        sMessage = "the aggregation " + sAggregationName + " of control " + sViewName;
        sAggregationNameNoSpaces = sAggregationName.replace(/ /g, "");

        if (iNumber === null) {
            // check has items only
            oMatcher = new that.matchers.AggregationFilled({
                name: sAggregationNameNoSpaces
            });
            sMessage += " contains items";
        } else if (iNumber === 0) {
            // check empty aggregation
            oMatcher = new that.matchers.AggregationEmpty({
                name: sAggregationNameNoSpaces
            });
            sMessage += " is empty";
        } else if (typeof iNumber === "number") {
            oMatcher = new that.matchers.AggregationLengthEquals({
                name: sAggregationNameNoSpaces,
                length: iNumber
            });
            sMessage += " contains " + iNumber + " items";
        } else {
            throw new Error("aggregationHasItems cannot parse the number of items in the aggregation '" + iNumber + "'");
        }

        var oWaitForOptions = {
            id: sId,
            matchers: oMatcher,
            success: function () {
                that.Opa5.assert.ok(true, sMessage);
            }
        };

        if (sViewPart) {
            oWaitForOptions.viewName = sViewName;
        }

        this.opa.waitFor(oWaitForOptions);
    }
};
