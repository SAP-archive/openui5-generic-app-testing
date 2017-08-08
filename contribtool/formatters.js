sap.ui.define([

], function () {
    "use strict";

    function isFirstBoundItem (bPrecondition) {
        return bPrecondition && parseInt(this.getBindingContext().getPath().split("/").pop(), 10) === 0;
    }

    function isNotFirstBoundItem (bPrecondition) {
        return bPrecondition && !isFirstBoundItem.call(this, true);
    }

    function parseRegExp (sRegExp) {
        var bIsRegExp,
            reRegExp;

        try {
            reRegExp = eval(sRegExp);
            bIsRegExp = reRegExp instanceof RegExp;
            if (!bIsRegExp) {
                return null;
            }
        } catch (e) {
            return null;
        }
        return reRegExp;
    }

    function isValidRegExp (sRegExp) {
        return !!parseRegExp(sRegExp);
    }

    function isInvalidRegExp (sRegExp) {
        return !isValidRegExp(sRegExp);
    }

    function isInvalidExample (sExample, sRegExp) {
        return !isValidExample(sExample, sRegExp);
    }

    function isValidExample (sExample, sRegExp) {
        var reRegExp = parseRegExp(sRegExp);

        return !!sExample.match(reRegExp);
    }

    function getImplementationError (sText) {
        try {
            eval(sText);
            return "";
        } catch (e) {
            return "Cannot parse this code: " + e;
        }
    }

    function hasImplementationError (sText) {
        return getImplementationError(sText).length > 0 ? true : false;
    }

    return {
        isFirstBoundItem: isFirstBoundItem,
        isNotFirstBoundItem: isNotFirstBoundItem,
        isValidRegExp: isValidRegExp,
        isInvalidRegExp: isInvalidRegExp,
        isInvalidExample: isInvalidExample,
        getImplementationError: getImplementationError,
        hasImplementationError: hasImplementationError
    };
}, true);
