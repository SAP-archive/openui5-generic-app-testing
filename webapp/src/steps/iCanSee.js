module.exports = {
	docs: {
		description: "Tests whether an element is visible in a certain view",
		synopsis: "I can see (CONTROL_ID | the [POS] [CONTROL_TYPE] control (deeply|directly) nested inside CONTROL_ID) [with PROPERTY 'TEXT'] [in VIEW_NAME view]",
		examples: [
			"I can see btnNext",
			"I can see btnNext with text 'next' in Detail view",
			"I can see lblTitle in Overview view",
			"I can see txtInput with value '1234ABCD' in Main view",
			"I can see txtInput with value containing '123' in Main view",
			"I can see txtInput with value containing '123'",
			"I can see boolSwitch with state is 'true'",
			"I can see boolSwitch with state is 'false' in Sub view",
			"I can see the 21st sap.m.Button control deeply nested inside grpButtons with text 'Apples' in Main view",
			"I can see the sap.m.Button control deeply nested inside grpButtons"
		]
	},
	icon: "show",

	regexp: new RegExp(["^I can see\\s+", "(",
		"(the( first| last| \\d+?st| \\d+?rd| \\d+?th| \\d+?nd)?( ([a-zA-Z]+[.])+[a-zA-Z]+)? control\\s(deeply|directly) nested inside ([a-zA-Z0-9]+))|" // nested expr
		, "([a-zA-Z0-9]+)" // <id>
		, ")", "(\\swith\\s([^\\s]+)\\s(is\\s|containing\\s|starting\\swith\\s|ending\\swith\\s)?'(.*?)')?" // [with <property> '<string>']
		, "(\\s+in\\s+(.+?)\\sview)?\\s*$" // in <viewName> view
	].join("")),
	action: function(
		sControlIdentifier, // nested expression or just id

		sWholeNestedExpression, // e.g., the 23rd sap.m.Text control deeply nested inside lstItems
		sMaybePosition, // e.g., " 23rd"
		sControlType, // e.g., " sap.m.Text"
		sControlPrefix, // e.g., "sap.m."
		sDeeplyOrDirectly, // e.g., "deeply|directly"
		sParentControlId, // e.g., "lstItems"

		sControlId, // if id is just given directly

		sWithProperty,
		sPropertyName,
		sTypeOfCheck,
		sValue,
		sViewPart,
		sViewName
	) {

		var that = this;
		
		sTypeOfCheck = (sTypeOfCheck || "equal to").replace(/\s+$/g, "");
		
		var oWaitForOptions = {
			id: sWholeNestedExpression ? sParentControlId : sControlId,
			success: function(oControl) { // based on sWholeNestedExpression

				var sInView = sViewName ? " in " + sViewName + " view" : "";
					
				if (sWholeNestedExpression) { // nested control search
					var oSearch = that.utils.findControl(
						sMaybePosition,
						sControlType,
						sWithProperty,
						sPropertyName,
						sTypeOfCheck,
						sValue,
						sDeeplyOrDirectly,
						oControl // the parent control in this case
					);
					that.Opa5.assert.ok(!!oSearch.found, sWholeNestedExpression + " " + sWithProperty + " was found" + sInView);
					return;
				}

				if (sWithProperty) { // value test
					var oMatch = that.utils.testControlProperty(
						oControl,
						sPropertyName, sTypeOfCheck, sValue
					);

					var sPossibleFailReason = oMatch.success ? "" : " ERROR: " + oMatch.reason;

					that.Opa5.assert.ok(oMatch.success, [
						sControlId, "with", sPropertyName, sTypeOfCheck + "'" + sValue + "'",
						"was found" + sInView + sPossibleFailReason
					].join(" "));

					return;
				}

				that.Opa5.assert.ok(true, [sControlId, "was found" + sInView].join(" "));
			}
		};

		if (sViewName) {
			oWaitForOptions.viewName = sViewName;
		}

		that.opa.waitFor(oWaitForOptions);
	}
};