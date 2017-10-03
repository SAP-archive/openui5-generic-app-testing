/*! openui5-generic-app-testing 2017-10-04 */

(function() {
    var module = {};
    function getGetterMethodName(sProperty) {
        return "get" + sProperty.charAt(0).toUpperCase() + sProperty.slice(1);
    }
    function positionTextToIndex(sPositionText, iNumItems) {
        var iIndex = -1;
        var oNamedPositions = {
            first: 0,
            last: iNumItems - 1
        };
        if (sPositionText.match(/^\d/)) {
            iIndex = parseInt(sPositionText.replace(/st|rd|th|nd/g, ""), 10) - 1;
        } else {
            iIndex = oNamedPositions[sPositionText];
        }
        if (typeof iIndex === "undefined" || iIndex === null) {
            throw new Error("Unrecognized position '" + sPositionText + "'");
        }
        return iIndex;
    }
    function findNestedAggregationItem(oTargetControl, oConstraints, bDeep, aControlsToCheck) {
        var oTargetControlMetadata = oTargetControl.getMetadata();
        var oFoundControl = null;
        Object.keys(oTargetControlMetadata._mAllAggregations).map(function(sAggregation) {
            return oTargetControlMetadata._mAllAggregations[sAggregation];
        }).filter(function(oAggregationMetadata) {
            return oAggregationMetadata.visibility === "public";
        }).forEach(function(oAggregationMetadata) {
            if (oFoundControl) {
                return;
            }
            var sAggregationName = oAggregationMetadata.name;
            var sPublicMethodName = getGetterMethodName(sAggregationName);
            var aChildControls = oTargetControl[sPublicMethodName]();
            if (Object.prototype.toString.apply(aChildControls) !== "[object Array]") {
                return;
            }
            oFoundControl = [ {
                constraint: "controlType",
                fn: function(oControl) {
                    return oControl.getMetadata()._sClassName === oConstraints.controlType;
                }
            }, {
                constraint: "property",
                fn: function(oControl) {
                    var sGetterFn = getGetterMethodName(oConstraints.property);
                    return typeof oControl[sGetterFn] === "function" && testTextValue(oConstraints.propertyOperand, oControl[sGetterFn](), oConstraints.propertyValue);
                }
            }, {
                constraint: "itemIndex",
                fn: function(oFoundControl, iControlIdx) {
                    return iControlIdx === oConstraints.itemIndex;
                }
            } ].reduce(function(aFilteredChildControls, oNextFilterSpec) {
                if (oConstraints.hasOwnProperty(oNextFilterSpec.constraint)) {
                    return aFilteredChildControls.filter(oNextFilterSpec.fn);
                }
                return aFilteredChildControls;
            }, aChildControls)[0] || null;
            if (!oFoundControl) {
                Array.prototype.push.apply(aControlsToCheck, aChildControls);
            }
        });
        if (!oFoundControl && aControlsToCheck.length > 0 && bDeep) {
            return findNestedAggregationItem(aControlsToCheck.shift(), oConstraints, bDeep, aControlsToCheck);
        }
        return {
            found: oFoundControl,
            remaining: aControlsToCheck
        };
    }
    function testTextValue(sOperand, sText, sValue) {
        switch (sOperand) {
          case "containing":
            return sText.indexOf(sValue) >= 0;

          case "starting with":
            return sText.indexOf(sValue) === 0;

          case "ending with":
            var iPosition = sText.indexOf(sValue);
            return iPosition > -1 && iPosition + sValue.length === sText.length;

          case "equal to":
            return sText === sValue;

          default:
            throw new Error("Invalid operand for text value check: '" + sOperand + "'");
        }
    }
    module.exports = {
        testTextValue: testTextValue,
        findNestedAggregationItem: findNestedAggregationItem,
        getGetterMethodName: getGetterMethodName,
        positionTextToIndex: positionTextToIndex
    };
    module.exports.name = "utils";
    sap.ui.define([], function() {
        return module.exports;
    });
})();