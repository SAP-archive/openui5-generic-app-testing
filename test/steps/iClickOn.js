/* global require describe it */

var assert = require("assert");
var oStep = require("../../src/steps/iClickOn");
var sinon = require("sinon");

describe("iClickOn", function() {

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
            "I click on btnShowCalendar in Overview view": {
                viewName: "Overview",
                id: "btnShowCalendar"
            }
        }, {
            "I click on btnConfirm in Main view 4 times": {
                viewName: "Main",
                id: "btnConfirm"
            }
        }, {
            "I click on btnConfirm": {
                id: "btnConfirm"
            }
        }, {
            "I click on btnConfirm 4 times": {
                id: "btnConfirm"
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
                delete oGotCallArg.actions;

                assert.deepEqual(oGotCallArg, oExpectedCallArg);
            });
        });
    });
});
