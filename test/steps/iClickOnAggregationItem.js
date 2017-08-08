/* global require describe it */

var assert = require("assert");
var oStep = require("../../src/steps/iClickOnAggregationItem");
var sinon = require("sinon");

describe("iClickOnAggregationItem", function() {

    function createFakeContext() {
        var oContext = {
            opa: {
                waitFor: sinon.stub()
            },
            actions: {
                Press: sinon.stub()
            }
        };

        return oContext;
    }

    describe("calls to opa#waitFor", function() {
        [{
            "I click on first item of leaveRequestTableA items in Overview view": {
                viewName: "Overview",
                id: "leaveRequestTableA"
            }
        }, {
            "I click on 2nd item of leaveRequestTableB items in Overview view": {
                viewName: "Overview",
                id: "leaveRequestTableB"
            }
        }, {
            "I click on last item of leaveRequestTableC items in Main view": {
                viewName: "Main",
                id: "leaveRequestTableC"
            }
        }, {
            "I click on last item of lstItems items": {
                id: "lstItems"
            }
        }].forEach(oFixture => {

            var sStep = Object.keys(oFixture)[0];

            it(`calls #waitFor as expected when step is '${sStep}'`, function() {
                var oExpectedCallArg = oFixture[sStep];
                var oFakeContext = createFakeContext();

                var aMatchResult = sStep.match(oStep.regexp);
                var aCallArgs = aMatchResult.slice(1);

                // Act
                oStep.action.apply(oFakeContext, aCallArgs);

                assert.ok(oFakeContext.opa.waitFor.callCount > 0,
                    "waitFor was called one or more times");

                var oGotCallArg = oFakeContext.opa.waitFor.getCall(0).args[0];
                delete oGotCallArg.success;

                assert.deepEqual(oGotCallArg, oExpectedCallArg);
            });
        });
    });
});
