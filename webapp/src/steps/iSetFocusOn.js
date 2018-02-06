module.exports = {
	docs: {
		description: "Set focus on a control",
		synopsis: "I set focus on '<controlId>' [in <viewName> view]",
		examples: ["I set focus on 'inputField'", "I set focus on 'saveButton' in Creation view"]
	},
	icon: "edit",
	regexp: /^I set focus on (.+?)( in ([a-zA-Z0-9\.]+) view)?$/,
	action: function(sControlId, sViewPart, sViewName) {
		var that = this;
		var oWaitForOptions = {
			id: sControlId,
			success: function(oControl) {

				//var ojQuery = sap.ui.test.Opa5.getJQuery();
				//var oDomRef = ojQuery.sap.domById(oControl.getId());
				//ojQuery.sap.focus(oDomRef);
				oControl.focus();
			}
		};
		if (sViewPart) {
			oWaitForOptions.viewName = sViewName;
		}
		this.opa.waitFor(oWaitForOptions);
	}
};