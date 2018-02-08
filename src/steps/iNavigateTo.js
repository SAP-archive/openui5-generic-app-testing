/**
 * This step will set a new hash to the app.
 * The app should react to the navigation by providing proper routing.
 *
 * ToDo: Add [with <JSON>] to synopsis to pass data as json
 *    regex: "(\\s+with\\s+(.+?))?"
 *    parsing: var oObject = JSON.parse(sObject);
 */
module.exports = {
    docs: {
        description: "Performs navigation using hash.",
        synopsis: "I navigate to <hash>",
        examples: [
            "I navigate to /Customers/4711",
            "I navigate to /Customers/4711?&tab=person"
        ]
    },
    regexp: new RegExp([
        "^",                          //start of string
        "I\\snavigate\\sto\\s",       //enty point
        "([=a-zA-Z0-9\/\?\&]+){1}",   //hash with parameters
        "$"                           //end of string
    ].join("")),
    icon: "locate-me",
<<<<<<< HEAD
    action: function(sHash) {
=======
    action: function(sId, sHash) {
>>>>>>> 9e0760be2d0f43745ba90220b9acab4ed9d1753d
        var oWaitForOptions, that, oHasherChanger;
        that = this;

        oHasherChanger = sap.ui.test.Opa5.getHashChanger();

        oHasherChanger.setHash(sHash);

        oWaitForOptions = {
            success: function() {
<<<<<<< HEAD
                that.Opa5.assert.strictEqual(oHasherChanger.getHash(), sHash, "Hash '" + sHash + "' set successfully.");
=======
                that.Opa5.assert.strictEquals(oHasherChanger.getHash(), sHash, "Hash '" + sHash + "' set successfully.");
>>>>>>> 9e0760be2d0f43745ba90220b9acab4ed9d1753d
            }
        };
        that.opa.waitFor(oWaitForOptions);

    }
};
