/* global require describe it */

var assert = require("assert");
var oStep = require("../../src/steps/iEnterText");
var sinon = require("sinon");

describe("iEnterText", function() {

    function createFakeContext() {
        var oContext = {
            opa: {
                waitFor: sinon.stub()
            },
            actions: {
                EnterText: sinon.stub()
            }
        };

        return oContext;
    }

    describe("calls to opa#waitFor", function() {
        [{
            "I enter 'hello' into txtNotesArea in Creation view": {
                id: "txtNotesArea",
                viewName: "Creation"
            }
        }, {
            "I enter 'something \"good\"' into txtInput in Main view": {
                id: "txtInput",
                viewName: "Main"
            }
        }, {
            "I enter '00012345689ABC' into txtProductId in Main view": {
                id: "txtProductId",
                viewName: "Main"
            }
        }, {
            "I enter 'something' into txtField": {
                id: "txtField"
            }
        }].forEach(oFixture => {

            var sStep = Object.keys(oFixture)[0];

            it(`calls #waitFor as expected when step is '${sStep}'`, function() {
                var oExpectedCallArg = oFixture[sStep];
                var oFakeContext = createFakeContext();

                var aMatchResult = sStep.match(oStep.regexp);
                assert.ok(true);

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
