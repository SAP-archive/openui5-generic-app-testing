/* global require describe it */

var oUtils = require("../../src/utils.js");
var assert = require("assert");

describe("getControlView", function () {
    sap = {};
    "ui.core.mvc.ViewType".split(".").reduce(function (oGlobalVar, sNextName) {
        oGlobalVar[sNextName] = {};
        return oGlobalVar[sNextName];
    }, sap);
    sap.ui.core.mvc.ViewType = {
        XML: "XML",
        JSON: "JSON"
    };

    it("returns the expected result for control at first level", function () {

        [
            { 
                id: "myControlXML", 
                control: { getMetadata: () => {
                    return { getElementName: () => "sap.ui.core.mvc.XMLView" }; 
                } },
                expected: true
            },
            { 
                id: "myControlJSON", 
                control: { getMetadata: () => {
                    return { getElementName: () => "sap.ui.core.mvc.JSONView" }; 
                } },
                expected: true
            },
            { 
                id: "myControlOther", 
                control: { 
                    getParent: () => null,
                    getMetadata: () => {
                        return { getElementName: () => "sap.ui.core.mvc.OtherView" }; 
                    }
                },
                expected: false 
            }
        ].forEach(oFixture => {
            var oResultView = oUtils.getControlView(oFixture.control);
            if (oFixture.expected) {
                assert.equal(oResultView, oFixture.control,
                    "returns the expected view for test id " + oFixture.id);
                return;
            }

            assert.equal(oResultView, null, "returns null for test id: " + oFixture.id);
        });
    });

    it("works through hierarchy of controls", function () {
        var oTargetControl = {
            getParent: () => null,
            getMetadata: () => {
                return { getElementName: () => "sap.ui.core.mvc.XMLView" }; 
            }
        };

        var oResultView = oUtils.getControlView({
            getMetadata: () => { return { getElementName: () => "something.else1" }; },
            getParent: () => {
                return {
                    getMetadata: () => { return { getElementName: () => "something.else2" }; },
                    getParent: () => oTargetControl
                };
            }
        });

        assert.equal(oResultView, oTargetControl,
            "returns the expected deeply nested view");
    });
});
