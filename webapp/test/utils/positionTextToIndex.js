/* global require describe it */

var oUtils = require("../../src/utils.js");
var assert = require("assert");

describe("positionTextToIndex", function () {
    it(`converts texts to the expected integer value`, function () {
        [
            { "first" : { expected : 0 } },
            { "last"  : { expected : 9, numItems : 10 } },
            { "34th"  : { expected : 33 } },
            { "31st"  : { expected : 30 } },
            { "22nd"  : { expected : 21 } },
            { "4th"   : { expected : 3  } }
        ].forEach(oSpec => {
            var sText = Object.keys(oSpec)[0];
            var iExpectedInteger = oSpec[sText].expected;
            var iNumItems = oSpec[sText].hasOwnProperty("numItems")
                ? oSpec[sText].numItems
                : iExpectedInteger;
            assert.equal(
                oUtils.positionTextToIndex(sText, iNumItems),
                iExpectedInteger
            );
        });
    });
});
