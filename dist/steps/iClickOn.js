/*! openui5-generic-app-testing 2017-08-09 */

(function() {
    var module = {};
    module.exports = {
        docs: {
            description: "Performs a click operation on an element with a certain id",
            synopsis: "I click on <id> [in <viewName> view] [<number> times]",
            examples: [ "I click on btnConfirm", "I click on btnShowCalendar in Overview view", "I click on btnConfirm in Main view 4 times", "I click on btnConfirm 4 times" ]
        },
        regexp: new RegExp([ "^I click on\\s+", "([a-zA-Z0-9]+)", "(\\s+in\\s+(.+?)\\sview)?", "(\\s(\\d+)\\stimes)?$" ].join("")),
        icon: "cursor-arrow",
        action: function(sId, sViewPart, sViewName, sNumTimesBit, sNumTimes) {
            var oWaitForOptions, iTimes, that;
            that = this;
            iTimes = sNumTimes ? parseInt(sNumTimes, 10) : 1;
            while (iTimes--) {
                oWaitForOptions = {
                    id: sId,
                    actions: new that.actions.Press()
                };
                if (sViewName) {
                    oWaitForOptions.viewName = sViewName;
                }
                that.opa.waitFor(oWaitForOptions);
            }
        }
    };
    module.exports.name = "iClickOn";
    sap.ui.define([], function() {
        return module.exports;
    });
})();