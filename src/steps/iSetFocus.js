module.exports = {
	docs: {
		description: "Set focus on a control",
		synopsis: "I set focus on <controlId> [in <viewName> view]",
		examples: ["I set focus on inputField", "I set focus on saveButton in Creation view"]
	},
	icon: "edit",
	regexp: new RegExp([
    "^I set focus on\\s", //start of string
    "(.+?)", //<controlId>
    "(\\sin\\s([a-zA-Z0-9\\.]+)\\sview)?", // view part
    "$" //end of string
  ].join("")),
	action: function(sControlId, sViewPart, sViewName) {
		var that = this;
		var oWaitForOptions = {
			id: sControlId,
			success: function(oControl) {

        that.Opa5.assert.ok(true, "Control " + sControlId + " has been found in " + sViewName + " view");

				oControl.focus();

			}
		};
		if (sViewPart) {
			oWaitForOptions.viewName = sViewName;
		}
		this.opa.waitFor(oWaitForOptions);
	}
};
