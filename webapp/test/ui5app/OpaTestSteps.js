sap.ui.define([
    "jquery.sap.global",
    "ui5app/utils/GenericSteps", // ui5app.utils mapped via sap-ui-resourceroots
    "sap/ui/test/gherkin/StepDefinitions",
    "sap/ui/test/Opa5"
], function($, oGenericSteps, StepDefinitions, Opa5) {

    return StepDefinitions.extend("ui5app/test/Steps", {
        init: function() {
            var opa = new Opa5();

            oGenericSteps.register(
                this, /* GherkinSteps */
                opa,  /* oOpaInstance */
                Opa5  /* Opa5 */
            );
        }
    });
});
