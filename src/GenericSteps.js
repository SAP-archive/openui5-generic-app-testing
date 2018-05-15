sap.ui.define([
    "jquery.sap.global",
    "./steps/index",
    "./utils",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/AggregationFilled",
    "sap/ui/test/matchers/AggregationEmpty",
    "sap/ui/test/matchers/AggregationLengthEquals"
], function ($, aSteps, oUtils, Press, EnterText, AggregationFilled, AggregationEmpty, AggregationLengthEquals) {
    "use strict";

    return {
        register: function (GherkinSteps, oOpaInstance, Opa5) {
            // register each regex
            aSteps.forEach(function (oStep) {
                GherkinSteps.register(
                    oStep.regexp,
                    oStep.action.bind({
                        sap: $.sap,
                        opa: oOpaInstance,
                        utils: oUtils,
                        Opa5: Opa5,
                        actions: {
                            Press: Press,
                            EnterText: EnterText
                        },
                        matchers: {
                            AggregationFilled: AggregationFilled,
                            AggregationEmpty: AggregationEmpty,
                            AggregationLengthEquals: AggregationLengthEquals
                        }
                    })
                );
            });
        }
    };
});
