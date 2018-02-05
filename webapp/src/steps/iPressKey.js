/*! openui5-generic-app-testing 2017-11-22 */

(function() {
	var module = {};
	module.exports = {
		docs: {
			description: "Fire a key press",
			synopsis: "I press '<key>' at <control> [in <viewName> view]",
			examples: ["I press 'ENTER'", "I press 'F1' in Creation view"]
		},
		icon: "edit",
		regexp: /^I press (.+?)(\s\+\s(ALT|SHIFT|CTRL))?\sat\s([a-zA-Z0-9]+)(\sin\s([a-zA-Z0-9\.]+)\sview)?$/,
		//regexp: new RegExp(["^I hit (.+?)", "( \+ (ALT|SHIFT|CTRL))?", " into ([a-zA-Z0-9]+)", "( in ([a-zA-Z0-9\.]+) view)?$"].join("")),
		action: function(sKey, sModifierPart, sModifier, sControlId, sViewPart, sViewName) {
			var that = this;
			var oWaitForOptions = {
				id: sControlId,
				success: function(oControl) {
					var oWindow = sap.ui.test.Opa5.getWindow(),
						ojQuery = sap.ui.test.Opa5.getJQuery(),
						oUtils = sap.ui.test.Opa5.getUtils(),
						sQueryKeyCode,
						bShiftKey = sModifier === "SHIFT" ? true : false,
						bAltKey = sModifier === "ALT" ? true : false,
						bCtrlKey = sModifier === "CTRL" ? true : false;

					if (!jQuery.sap.KeyCodes[sKey]) {
						that.Opa5.assert.ok(false, "Key" + sKey + " is not an enum of jQuery.sap.KeyCodes");
					}

					/**
					 * Programmatically triggers a 'keydown' event on a specified target.
					 * @see sap.ui.test.qunit.triggerKeyEvent
					 *
					 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
					 * @param {string | int} sKey The keys name as defined in <code>jQuery.sap.KeyCodes</code> or its key code
					 * @param {boolean} bShiftKey Indicates whether the shift key is down in addition
					 * @param {boolean} bAltKey Indicates whether the alt key is down in addition
					 * @param {boolean} bCtrlKey Indicates whether the ctrl key is down in addition
					 * @public
					 */
					oUtils.triggerKeyboardEvent(oControl.getId(), sKey, bShiftKey, bAltKey, bCtrlKey);

				}
			};
			if (sViewPart) {
				oWaitForOptions.viewName = sViewName;
			}
			this.opa.waitFor(oWaitForOptions);
		}
	};
	module.exports.name = "iHitKey";
	sap.ui.define([], function() {
		return module.exports;
	});
})();