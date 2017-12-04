/* global require describe it */

var assert = require("assert");
var oStep = require("../../src/steps/iCanSee");
var oUtils = require("../../src/utils");
var sinon = require("sinon");

describe("iCanSee", function() {

    function createFakeContext() {
        var oContext = {
            opa: {
                waitFor: sinon.stub()
            },
            utils: oUtils
        };

        return oContext;
    }

    describe("calls to opa#waitFor", function() {
        [{
            "I can see btnNext with text 'next' in Detail view": {
                id: "btnNext",
                viewName: "Detail"
                // don't compare success function. It's checked in the test...
            },
        }, {
            "I can see lblTitle in Overview view": {
                id: "lblTitle",
                viewName: "Overview"
            },
        }, {
            "I can see txtInput with value '1234ABCD' in Main view": {
                id: "txtInput",
                viewName: "Main"
            },
        }, {
            "I can see txtInput with value containing '123' in Main view": {
                id: "txtInput",
                viewName: "Main"
            }
        }, {
            "I can see btnNext": { id: "btnNext" }
        }, {
            "I can see txtInput with value containing '123'": { id: "txtInput" }
        }].forEach(oFixture => {

            var sStep = Object.keys(oFixture)[0];

            it(`calls #waitFor as expected when step is '${sStep}'`, function() {
                var oExpectedCallArg = oFixture[sStep];
                var oFakeContext = createFakeContext();

                var aMatchResult = sStep.match(oStep.regexp);
                var aCallArgs = aMatchResult.slice(1);

                // Act
                oStep.action.apply(oFakeContext, aCallArgs);

                assert.strictEqual(oFakeContext.opa.waitFor.callCount, 1);

                var oGotCallArg = oFakeContext.opa.waitFor.getCall(0).args[0];
                assert.strictEqual(typeof oGotCallArg.success, "function");

                delete oGotCallArg.success;

                assert.deepEqual(oGotCallArg, oExpectedCallArg);
            });
        });
    });
});
