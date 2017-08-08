/* global require describe it */

var assert = require("assert");
var aAllStepNames;

const fs = require("fs");

aAllStepNames = fs.readdirSync("./src/steps")
    .filter(
        sFile => sFile.indexOf("index.") === -1
            && sFile.match(/.js$/)
    )
    .map(sFile => sFile.replace(".js", ""));


describe("All steps", function () {
    aAllStepNames.forEach(sStep => {
        var oStep = require("../src/steps/" + sStep);
        describe("#" + sStep, function () {
            it(`has expected members`, function () {
                [
                    { name: "docs",   type: "object" },
                    { name: "regexp", type: "object" },
                    { name: "action", type: "function" }
                ].forEach(oExpectedSection => {
                    assert.equal(
                        oStep.hasOwnProperty(oExpectedSection.name), true,
                        "exports " + oExpectedSection.name
                    );

                    assert.equal(
                        typeof oStep[oExpectedSection.name],
                        oExpectedSection.type,
                        "section " + oExpectedSection.name + " has '" + oExpectedSection.type +  "' type"
                    );
                });
            });
            it(`validates all examples against the regexp`, function () {
                oStep.docs.examples.forEach(function (sExample) {
                    assert.equal(
                        !!sExample.match(oStep.regexp),
                        true,
                        `Example '${sExample}' matches regexp '${oStep.regexp}'`
                    );
                });
            });
        });
    });
});
