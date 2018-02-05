/* global require describe it */

var oUtils = require("../../src/utils.js");
var assert = require("assert");

describe("testTextValue", function () {
    it(`returns the expected result`, function () {
        [
            { operand: "containing", text: "hello", value: "ll", 
              expected: true },
            { operand: "containing", text: "hello", value: "lll",
              expected: false },
            { operand: "starting with", text: "hello", value: "ello",
              expected: false },
            { operand: "starting with", text: "hello", value: "hell",
              expected: true },
            { operand: "starting with", text: "hello", value: "h",
              expected: true },
            { operand: "ending with", text: "hello", value: "llo",
              expected: true },
            { operand: "ending with", text: "hello", value: "o",
              expected: true },
            { operand: "ending with", text: "o", value: "hello",
              expected: false },
            { operand: "ending with", text: "hello", value: "h",
              expected: false },
            { operand: "equal to", text: "hello", value: "hello",
              expected: true },
            { operand: "equal to", text: "hi", value: "hello",
              expected: false },
            { operand: "something else", text: "hello", value: "h",
              expected: "throws" }
        ].forEach(oFixture => {
            if (typeof oFixture.expected === "boolean") {
                assert.equal(
                    oUtils.testTextValue(oFixture.operand, oFixture.text, oFixture.value),
                    oFixture.expected,
                    "correct result for " + oFixture.text + " " + oFixture.operand + " " + oFixture.value
                );
            } else if (oFixture.expected === "throws") {
                assert.throws(
                    oUtils.testTextValue.bind(null, oFixture.operand, oFixture.text, oFixture.value)
                );
            } else {
                throw "Unknown expectation: " + oFixture.expected;
            }
        });
    });
});
