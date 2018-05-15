module.exports = {
    docs: {
        description: "Performs a click operation on an element with a certain id",
        synopsis: "I click on CONTROL_ID [in VIEW_NAME view] [NUMBER times]",
        examples: [
            "I click on btnConfirm",
            "I click on btnShowCalendar in Overview view",
            "I click on btnConfirm in Main view 4 times",
            "I click on btnConfirm 4 times"
        ]
    },
    regexp: new RegExp(["^I click on\\s+"
        , "([a-zA-Z0-9]+)"         // <id>
        , "(\\s+in\\s+(.+?)\\sview)?" // in <viewName> view
        , "(\\s(\\d+)\\stimes)?$"  // [<number> times]
    ].join("")),
    icon: "cursor-arrow",
    action: function (sId, sViewPart, sViewName, sNumTimesBit, sNumTimes) {
        "use strict";
        var oWaitForOptions,
            iTimes,
            that;

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
