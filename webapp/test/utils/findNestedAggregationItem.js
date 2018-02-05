/* global require describe it */

var oUtils = require("../../src/utils.js");
var assert = require("assert");

function createFakeUi5Control(sControlType, oControlProperties = {}, aChildControls = []) {
    var oControl = {
        getMetadata() {
            return {
                _sClassName: sControlType,
                _mAllAggregations: {
                    items: { name: "items", visibility: "public" }
                }
            };
        },
        getItems() {
            return aChildControls;
        }
    };

    Object.keys(oControlProperties).forEach(sProperty => {
        var sGetterName = oUtils.getGetterMethodName(sProperty);
        oControl[sGetterName] = () => {
            return oControlProperties[sProperty];
        };
    });

    return oControl;
}

describe("findNestedAggregationItem", function () {

    it(`can find item directly nested in control hierarchy`, function () {
        var cc = createFakeUi5Control;

        var oFakeControl = cc("sap.m.List", {}, [
            cc("sap.m.Label", { id: "A" }),
            cc("sap.m.Label", { id: "B" }),
            cc("sap.m.Label", { id: "C" })
        ]);

        var oConstraints = {
            itemIndex: 1,
            controlType: "sap.m.Label"
        };

        var oResult = oUtils.findNestedAggregationItem(
            oFakeControl,
            oConstraints,
            false /* bDeep */,
            [] /* aControlsToCheck */
        );

        assert.notEqual(oResult.found, null, "a non-null object was returned");
        assert.equal(oResult.found.getId(), "B", "the right control was found");
    });

    it(`cannot find item deeply nested in control hierarchy when deep search is disabled`, function () {
        var cc = createFakeUi5Control;

        var oFakeControl = cc("sap.m.List", {}, [
            cc("sap.m.Label"),
            cc("sap.m.Label", {}, [
                cc("sap.m.Text", { id: "B1" })
            ]),
            cc("sap.m.Label")
        ]);

        var oConstraints = {
            itemIndex: 0,
            controlType: "sap.m.Text"
        };

        var oResult = oUtils.findNestedAggregationItem(
            oFakeControl,
            oConstraints,
            false /* bDeep */,
            [] /* aControlsToCheck */
        );

        assert.equal(oResult.found, null, "a null object was returned");
    });

    it(`can find item deeply nested in control hierarchy when deep search is enabled`, function () {
        var cc = createFakeUi5Control;

        var oFakeControl = cc("sap.m.List", {}, [
            cc("sap.m.Label"),
            cc("sap.m.Label", {}, [
                cc("sap.m.Text", { id: "B1" })
            ]),
            cc("sap.m.Label")
        ]);

        var oConstraints = {
            itemIndex: 0,
            controlType: "sap.m.Text"
        };

        var oResult = oUtils.findNestedAggregationItem(
            oFakeControl,
            oConstraints,
            true /* bDeep */,
            [] /* aControlsToCheck */
        );

        assert.notEqual(oResult.found, null, "a non-null object was returned");
        assert.equal(oResult.found.getId(), "B1", "the right control was found");
    });

    it(`can find item deeply nested in control hierarchy by property 'equal to' value`, function () {
        var cc = createFakeUi5Control;

        var oFakeControl = cc("sap.m.List", {}, [
            cc("sap.m.Label"),
            cc("sap.m.Label", {}, [
                cc("sap.m.Text", { id: "B1", text: "fie" }),
                cc("sap.m.Text", { id: "B2", text: "foo" })
            ]),
            cc("sap.m.Label")
        ]);

        var oConstraints = {
            property: "text",
            propertyOperand: "equal to",
            propertyValue: "foo"
        };

        var oResult = oUtils.findNestedAggregationItem(
            oFakeControl,
            oConstraints,
            true /* bDeep */,
            [] /* aControlsToCheck */
        );

        assert.notEqual(oResult.found, null, "a non-null object was returned");
        assert.equal(oResult.found.getId(), "B2", "the right control was found");
    });

    it(`can find item deeply nested in control hierarchy by property 'containing' value`, function () {
        var cc = createFakeUi5Control;

        var oFakeControl = cc("sap.m.List", {}, [
            cc("sap.m.Label"),
            cc("sap.m.Label", {}, [
                cc("sap.m.Text", { id: "B1", text: "fie" }),
                cc("sap.m.Text", { id: "B2", text: "foo" })
            ]),
            cc("sap.m.Label")
        ]);

        var oConstraints = {
            property: "text",
            propertyOperand: "containing",
            propertyValue: "ie"
        };

        var oResult = oUtils.findNestedAggregationItem(
            oFakeControl,
            oConstraints,
            true /* bDeep */,
            [] /* aControlsToCheck */
        );

        assert.notEqual(oResult.found, null, "a non-null object was returned");
        assert.equal(oResult.found.getId(), "B1", "the right control was found");
    });
});
