/* global require describe it */

var assert = require("assert");
var oStep = require("../../src/steps/aggregationHasItems");
var sinon = require("sinon");

describe("aggregationHasItems", function() {

    function createFakeContext() {
        var oContext = {
            opa: {
                waitFor: sinon.stub()
            },
            actions: {
                Press: sinon.stub()
            },
            matchers: {
                AggregationFilled: sinon.stub(),
                AggregationLengthEquals: sinon.stub(),
                AggregationEmpty: sinon.stub(),
            }
        };

        return oContext;
    }

    describe("calls to opa#waitFor", function() {
        [{
            "lstShapes contains 10 items": {
                id: "lstShapes"
            },
        }, {
            "lstShapes in Main view contains items": {
                id: "lstShapes",
                viewName: "Main"
            },
        }, {
            "lstCities in Overview view contains 31 items": {
                id: "lstCities",
                viewName: "Overview"
            },
        }, {
            "lstCities in Detail view contains 0 items": {
                id: "lstCities",
                viewName: "Detail"
            },
        }, {
            "lstCities in Overview view contains no items": {
                id: "lstCities",
                viewName: "Overview"
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
                delete oGotCallArg.matchers;

                assert.deepEqual(oGotCallArg, oExpectedCallArg);
            });
        });
    });
});
