sap.ui.define([
    "contribtool/formatters",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "dist/steps/index"
], function (oFormatters, Controller, JSONModel, aAllActions) {
    "use strict";

    /* global jQuery */

    var S_GITHUB_API_BASE = "https://github.wdf.sap.corp/api/v3";

    var oActionTemplate = {
        name: "myStep",
        regexp: "/I (write) (an) (.+)/",
        action: [
            "function myStep (sCapturingBlock1, sCapturingBlock2, sCapturingBlock3) {",
            "     \/\/ dependencies are injected in the context",
            "     var opa = this.opa;",
            "     var Opa5 = this.Opa5;",
            "     var Press = this.actions.Press;",
            "",
            "     \/\/ regular OPA5 usage...",
            "     opa.waitFor({",
            "         \/\/ ...",
            "     });",
            "",
            "     \/\/ ... assertions...",
            "     Opa5.assert.ok(true, \"it works\");",
            "}"
        ].join("\n"),
        icon: "step",
        docs: {
            description: "This sample step...",
            synopsis: "Some <required> and [optional]",
            examples: ["I write an example"]
        }
    };

    var oAceSelectionMarkers = { };

    var S_SAMPLE_SPEC_PATH = "test/ui5app/specs/Test.feature";

    // fix code
    aAllActions.forEach(function (oAction) {
        // check how many spaces to remove
        var iHowMany = -1;
        oAction.action.toString().split("\n").forEach(function (sLine) {
            var oMatch = sLine.match(/^\s+/);
            if (oMatch && (iHowMany === -1 || oMatch[0].length < iHowMany)) {
                iHowMany = oMatch[0].length;
            }
        });

        // remove from each line
        var reReplace = new RegExp("^\\s{" + iHowMany + "}");
        oAction.action = oAction.action.toString().split("\n").map(function (sLine) {
            return sLine.replace(reReplace, "");
        }).join("\n");

        // add name of action after the function
        /* eslint-disable quotes */
        oAction.action = oAction.action
            .replace("function", "function " + oAction.name);
        /* eslint-enable quotes */

        // regexp -> string
        oAction.regexp = oAction.regexp.toString();
    });

    return Controller.extend("contribtool.controller.App", {
        onInit: function () {
            var that = this;
            that.getView().setModel(new JSONModel({
                githubUser: "",
                githubPassword: "",
                selectedAction: aAllActions[0],
                allActions: aAllActions,
                suggestingNewAction: false,
                lastSelectedActionIndex: 0, // the first action
                visibleTool: "browser", // validator
                specValidationData: [],
                showValidationErrors: true,
                showValidationSuccess: true
            }));


            jQuery.get(S_SAMPLE_SPEC_PATH).done(function (sSpec) {
                // set sample spec text
                that.byId("specValidator").setValue(sSpec);
            });

            ["specValidator", "regExpEditor", "functionEditor"].forEach(function (sEditorInstance) {
                that.byId(sEditorInstance)._getEditorInstance().setOptions({
                    maxLines: Infinity
                });
            });
        },
        setCurrentTool: function (oEvent) {
            var sChosenTool = oEvent.getSource().data("toolName");

            // unpress the other one
            oEvent.getSource().getParent().getAggregation("contentRight").forEach(function (oButton) {
                var sToolName = oButton.data("toolName");
                if (sToolName && sToolName !== sChosenTool) {
                    oButton.setPressed(false);
                }
            });

            this.setData("/visibleTool", sChosenTool);
        },
        onSpecValidatorLiveChange: function (oEvent) {
            this.removeAllEditorHighlights("specValidator");
            this.validateSpec(oEvent.getParameter("value"));
        },
        removeAllEditorHighlights: function (sEditorId) {
            if (!sEditorId) {
                throw new Error("no editor id was specified");
            }
            if (!oAceSelectionMarkers[sEditorId]) {
                jQuery.sap.log.warning(
                    "no markers were found for editor " + sEditorId
                );
                return;
            }

            var oEditor = this.byId(sEditorId)._getEditorInstance();
            while (oAceSelectionMarkers[sEditorId].length > 0) {
                oEditor.getSession().removeMarker(oAceSelectionMarkers[sEditorId].shift());
            }
        },
        highlightEditorLines: function (sEditorId, sCssMarkerClass, iFrom, iTo) {
            if (typeof iTo === "undefined") {
                iTo = iFrom;
            }

            /* global ace */
            var Range = ace.require("ace/range").Range;
            var oEditor = this.byId(sEditorId)._getEditorInstance();
            var oRange = new Range(iFrom, 0, iTo, 1);
            var oAddedMarker = oEditor.getSession().addMarker(oRange, sCssMarkerClass, "fullLine");

            if (!oAceSelectionMarkers[sEditorId]) {
                oAceSelectionMarkers[sEditorId] = [];
            }

            oAceSelectionMarkers[sEditorId].push(oAddedMarker);
        },
        updateSelectedActionIcon: function (oEvent) {
            var sNewIcon = oEvent.getParameter("newValue");

            this.setData("/selectedAction/icon", sNewIcon);
        },
        onOnlyErrorsPress: function (oEvent) {
            var bOnlyErrors = oEvent.getSource().getSelected();
            this.setData("/showValidationSuccess", !bOnlyErrors);
            this.removeAllEditorHighlights("specValidator");
            this.validateSpec(this.byId("specValidator").getValue());
        },
        validateSpec: function (sSpec) {
            var that = this;
            var aValidationResult = [];
            var oModel = this.getView().getModel();

            sSpec.split("\n").forEach(function (sSpecLine, iIdx) {
                if (!sSpecLine.match(/^\s*(Given|When|Then|And)\s+/)) {
                    return;
                }

                var sMaybeGherkinGenericStep = sSpecLine.split(/^\s*?(Given|When|Then|And)\s+/).pop();

                // validate against each action
                var aMatches = [];
                aAllActions.forEach(function (oAction) {
                    var reRegExp = eval(oAction.regexp);

                    if (sMaybeGherkinGenericStep.match(reRegExp)) {
                        aMatches.push(oAction);
                    }
                });

                if (aMatches.length > 1) {
                    if (oModel.getProperty("/showValidationErrors")) {
                        aValidationResult.push({
                            line: iIdx + 1,
                            title: "multiple steps matched",
                            description: aMatches.map(function (oAction) { return oAction.name; }).join(", "),
                            isError: true
                        });
                    }
                } else if (aMatches.length === 1) {
                    if (oModel.getProperty("/showValidationSuccess")) {
                        aValidationResult.push({
                            line: iIdx + 1,
                            title: aMatches[0].name,
                            description: "",
                            isError: false
                        });
                    }
                } else if (aMatches.length === 0) {
                    if (oModel.getProperty("/showValidationErrors")) {
                        aValidationResult.push({
                            line: iIdx + 1,
                            title: "No generic step was matched",
                            description: "",
                            isError: true 
                        });
                    }
                }

                that.highlightEditorLines(
                    "specValidator",
                    aMatches.length > 0 ? "contribtoolAceGreen" : "contribtoolAceRed",
                    iIdx, iIdx
                );

            });

            this.setData("/specValidationData", aValidationResult);
        },
        onSearchLiveChange: function (oSearchEvent) {
            var sSearch = oSearchEvent.getParameter("newValue");

            if (!sSearch || sSearch === "") {
                this.setData("/allActions", aAllActions);
                return;
            }

            var aMatchingActions = aAllActions.filter(function (oAction) {
                return oAction.name.indexOf(sSearch) >= 0 ||
                    oAction.docs.description.indexOf(sSearch) >= 0;
            });

            this.setData("/allActions", aMatchingActions);
        },
        onTileSelected: function (oEvent) {
            var oSelectedAction = oEvent.getSource().getBindingContext().getObject();
            var aAllActions = this.getData("/allActions");
            var iSelectedActionId = aAllActions.indexOf(oSelectedAction);

            this.setData("/lastSelectedActionIndex", iSelectedActionId);

            // must be a string
            this.setData("/selectedAction", JSON.parse(JSON.stringify(oSelectedAction)));
        },
        setData: function (sKey, sValue) {
            var oModel = this.getView().getModel();
            oModel.setProperty(sKey, sValue);
        },
        getData: function (sKey) {
            var oModel = this.getView().getModel();
            return oModel.getProperty(sKey);
        },
        onSuggestNewActionClicked: function () {
            // prepare new action
            this.setData("/selectedAction", jQuery.extend(true, {}, oActionTemplate));

            // enable editing
            this.setData("/suggestingNewAction", true);
        },
        onAddExampleClicked: function () {
            var aCurrentExamples = this.getData("/selectedAction/docs/examples");
            aCurrentExamples.push("");
            this.setData("/selectedAction/docs/examples", aCurrentExamples);
        },
        onRemoveExampleClicked: function (oEvent) {
            var iItemIdxToDelete = parseInt(
                oEvent.getSource().getBindingContext().getPath().split("/").pop(),
                10
            );

            var aExamples = this.getData("/selectedAction/docs/examples");

            this.setData("/selectedAction/docs/examples", aExamples.filter(
                function (sExample, iIdx) {
                    return iIdx !== iItemIdxToDelete;
                }
            ));
        },
        cancelSuggestion: function () {
            var iLastSelectedActionIdx = this.getData("/lastSelectedActionIndex");
            var aAllActions = this.getData("/allActions");
            var oPreviousAction = aAllActions[iLastSelectedActionIdx];

            this.setData("/selectedAction", oPreviousAction);
            this.setData("/suggestingNewAction", false);
        },
        onCancelSuggestionClicked: function () {
            this.cancelSuggestion();
        },
        onSendSuggestionClicked: function () {
            function removeQuotes(sTextLine, sMemberName) {
                /* eslint-disable quotes */
                return sTextLine.replace(new RegExp('"' + sMemberName + '": "'), '"' + sMemberName + '": ')
                    .replace(/",$/, ",")
                    .replace(/"$/, '');
                /* eslint-enable quotes */
            }
            var that = this;

            // adjust the suggested action
            var oSuggestedAction = this.getData("/selectedAction");

            // compose the content of the file
            var sContent = "";
            try {
                sContent = "module.exports = " + JSON.stringify(oSuggestedAction, null, 3).split("\n").map(function (sLine) {
                    if (sLine.match(/^\s+"regexp"/)) {
                        return removeQuotes(sLine, "regexp");
                    }
                    if (sLine.match(/^\s+"action"/)) {
                        /* eslint-disable quotes */
                        return removeQuotes(sLine, "action")
                            .replace(/function .+?\s/, "function ")
                            .replace(/\\n/g, "\n")
                            .replace(/\\"/g, '"');
                        /* eslint-enable quotes */
                    }
                    
                    return sLine;
                }).join("\n") + ";";
            } catch (e) {
                jQuery.sap.log.error(e);
                sContent = JSON.stringify(oSuggestedAction, null, 3).replace(/\\n/g, "\n");
            }

            var oGistFile = {};
            oGistFile[oSuggestedAction.name] = {
                content: sContent
            };
            
            // create a github gist
            jQuery.ajax({
                method: "POST",
                url: S_GITHUB_API_BASE + "/gists",
                dataType: "json",
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify({
                    "description": "Suggestion for a new Gherkin Generic Step" + oSuggestedAction.docs.description,
                    "public": true,
                    "files": oGistFile
                }, null, 3)
            }).done(function (oResponse) {
                //  {
                //    "url": "https://github.wdf.sap.corp/api/v3/gists/289663c287871221bfb7756b7841a535",
                //    "forks_url": "https://github.wdf.sap.corp/api/v3/gists/289663c287871221bfb7756b7841a535/forks",
                //    "commits_url": "https://github.wdf.sap.corp/api/v3/gists/289663c287871221bfb7756b7841a535/commits",
                //    "id": "289663c287871221bfb7756b7841a535",
                //    "git_pull_url": "https://github.wdf.sap.corp/gist/289663c287871221bfb7756b7841a535.git",
                //    "git_push_url": "https://github.wdf.sap.corp/gist/289663c287871221bfb7756b7841a535.git",
                //    "html_url": "https://github.wdf.sap.corp/gist/289663c287871221bfb7756b7841a535",
                //    "files": {
                //      "iCanTest.js": {
                //        "filename": "iCanTest.js",
                //        "type": "application/javascript",
                //        "language": "JavaScript",
                //        "raw_url": "https://github.wdf.sap.corp/gist/anonymous/289663c287871221bfb7756b7841a535/raw/9558ab2cbb6fef42320708bda9d6f62b30717468/iCanTest.js",
                //        "size": 39,
                //        "truncated": false,
                //        "content": "function () { var a = 1; \n var c = 2; }"
                //      }
                //    },
                //    "public": true,
                //    "created_at": "2017-05-18T08:33:26Z",
                //    "updated_at": "2017-05-18T08:33:26Z",
                //    "description": "This is a sample gist",
                //    "comments": 0,
                //    "user": null,
                //    "comments_url": "https://github.wdf.sap.corp/api/v3/gists/289663c287871221bfb7756b7841a535/comments",
                //    "forks": [
                //  
                //    ],
                //    "history": [
                //      {
                //        "user": null,
                //        "version": "f7b7abfb0b311a303b50de433a449ac3b6baa5e0",
                //        "committed_at": "2017-05-18T08:33:26Z",
                //        "change_status": {
                //          "total": 2,
                //          "additions": 2,
                //          "deletions": 0
                //        },
                //        "url": "https://github.wdf.sap.corp/api/v3/gists/289663c287871221bfb7756b7841a535/f7b7abfb0b311a303b50de433a449ac3b6baa5e0"
                //      }
                //    ],
                //    "truncated": false
                //  }
                var sHtmlUrl = oResponse.html_url;
                var sFileName = Object.keys(oResponse.files)[0];
                var sIssueTitle = "Please add " + sFileName + " as a generic step";

                jQuery.ajax({
                    method: "POST",
                    url: S_GITHUB_API_BASE + "/repos/SAP/openui5-generic-app-testing/issues",
                    beforeSend: function (xhr) {
                        var sUser = that.getData("/githubUser");
                        var sPass = that.getData("/githubPassword");
                        xhr.setRequestHeader("Authorization", "Basic " + btoa(sUser + ":" + sPass));
                    },
                    dataType: "json",
                    contentType:"application/json; charset=utf-8",
                    data: JSON.stringify({
                        "title": sIssueTitle,
                        "body": "Please add " + sFileName + " to this project: " + sHtmlUrl
                    })
                }).done(function (oIssueResponse) {
                    // {
                    //   "url": "https://<github-domain>/api/v3/repos/SAP/openui5-generic-app-testing/issues/1",
                    //   "repository_url": "https://<github-domain>/api/v3/repos/SAP/openui5-generic-app-testing",
                    //   "labels_url": "https://<github-domain>/api/v3/repos/SAP/openui5-generic-app-testing/issues/1/labels{/name}",
                    //   "comments_url": "https://<github-domain>/api/v3/repos/SAP/openui5-generic-app-testing/issues/1/comments",
                    //   "events_url": "https://<github-domain>/api/v3/repos/SAP/openui5-generic-app-testing/issues/1/events",
                    //   "html_url": "https://<github-domain>/SAP/openui5-generic-app-testing/issues/1",
                    //   "id": 481244,
                    //   "number": 1,
                    //   "title": "Issue create via API",
                    //   "user": {
                    //     "login": "SAP",
                    //     "id": 5438,
                    //     "avatar_url": "https://<github-domain>/avatars/u/5438?",
                    //     "gravatar_id": "",
                    //     "url": "https://<github-domain>/api/v3/users/SAP",
                    //     "html_url": "https://<github-domain>/SAP",
                    //     "followers_url": "https://<github-domain>/api/v3/users/SAP/followers",
                    //     "following_url": "https://<github-domain>/api/v3/users/SAP/following{/other_user}",
                    //     "gists_url": "https://<github-domain>/api/v3/users/SAP/gists{/gist_id}",
                    //     "starred_url": "https://<github-domain>/api/v3/users/SAP/starred{/owner}{/repo}",
                    //     "subscriptions_url": "https://<github-domain>/api/v3/users/SAP/subscriptions",
                    //     "organizations_url": "https://<github-domain>/api/v3/users/SAP/orgs",
                    //     "repos_url": "https://<github-domain>/api/v3/users/SAP/repos",
                    //     "events_url": "https://<github-domain>/api/v3/users/SAP/events{/privacy}",
                    //     "received_events_url": "https://<github-domain>/api/v3/users/SAP/received_events",
                    //     "type": "User",
                    //     "site_admin": false
                    //   },
                    //   "labels": [

                    //   ],
                    //   "state": "open",
                    //   "locked": false,
                    //   "assignee": null,
                    //   "assignees": [

                    //   ],
                    //   "milestone": null,
                    //   "comments": 0,
                    //   "created_at": "2017-05-18T08:59:31Z",
                    //   "updated_at": "2017-05-18T08:59:31Z",
                    //   "closed_at": null,
                    //   "body": "Check this out",
                    //   "closed_by": null
                    // }
                    console.log(oIssueResponse.url);
                }).fail(function (oError) {
                    window.alert("Gist was created, but an error occurred while creating the github issue");
                    console.log(oError);
                });
                console.log(oResponse);
            }).fail(function (oError) {
                window.alert("Error occurred while creating the gist");
                console.log(oError);
            }).always(function () {
                that.cancelSuggestion();
            });
        }
    });
});
