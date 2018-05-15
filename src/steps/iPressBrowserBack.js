module.exports = {
    docs: {
        description: "Performs a back navigation if the app is running in the Fiori Launchpad or just performs back navigation via window.history.back().",
        synopsis: "I (go back|press browser back)",
        examples: [
            "I press browser back",
            "I go back"
        ]
    },
    icon: "nav-back",
    regexp: /I\s(go back|press browser back)$/i,
    action: function () {
        "use strict";

        var oAppWindow = this.Opa5.getWindow(),
            oContainer = oAppWindow && oAppWindow.sap && oAppWindow.sap.ushell && oAppWindow.sap.ushell.Container;

        if (oContainer) {
            oContainer.getService("CrossApplicationNavigation").backToPreviousApp();
            return;
        }

        window.history.back();
    }
};
