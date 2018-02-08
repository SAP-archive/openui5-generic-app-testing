module.exports = {
	docs: {
		description: "Checks if a control has focus",
		synopsis: "Control <controlId> has focus [in <viewName> view]",
		examples: ["Control inputField has focus", "Control saveButton has focus in Creation view"]
	},
	icon: "edit",
	regexp: new RegExp([
    "^Control\\s", //start of string
    "(.+?)", //<controlId>
    "\\shas\\sfocus",
    "(\\sin\\s([a-zA-Z0-9\\.]+)\\sview)?", // view part
    "$" //end of string
  ].join("")),
	action: function(sControlId, sViewPart, sViewName) {
		var that = this;
		var oWaitForOptions = {
			id: sControlId,
			success: function(oControl) {

        that.Opa5.assert.ok(true, "Control " + sControlId + " has been found in " + sViewName + " view");

        that.Opa5.assert.ok(oControl.$().hasClass("sapMFocus"), "Control " + sControlId + " has focus (has class 'sapMFocus')");

			}
		};
		if (sViewPart) {
			oWaitForOptions.viewName = sViewName;
		}
		this.opa.waitFor(oWaitForOptions);
	}
};
