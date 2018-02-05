module.exports = {
	docs: {
		description: "Performs navigation using hash",
		synopsis: "I navigate to <hash> [with <object>]",
		examples: [
			"I navigate to /Start/GoodsReceipts",
			"I navigate to /Start/GoodsReceipts with {'OrderNumber': '4711'}"
		]
	},
	regexp: new RegExp(["^I navigate to\\s+", "(\/[a-zA-Z0-9\/]+)", "(\\s+with\\s+(.+?)\\s)?$"].join("")),
	icon: "cursor-arrow",
	action: function(sId, sHash, sObject) {
		var oWaitForOptions, oObject, that, oHasherChanger;
		that = this;

		oObject = JSON.parse(sObject);

		oHasherChanger = sap.ui.test.Opa5.getHashChanger();

		oHasherChanger.setHash(sHash);

		oWaitForOptions = {
			success: function() {
				that.Opa5.assert.strictEquals(oHasherChanger.getHash(), sHash, "Hash '" + sHash + "' set successfully.");
			}
		};
		that.opa.waitFor(oWaitForOptions);

	}
};