import React from 'react';
import ObjectAssign from 'object-assign';


function isRawType(value) {
    var type = typeof value;
    return type === 'string' ||
        type === 'number' ||
        type === 'boolean' ||
        type === 'undefined' ||
        value === null;
}

const DefaultOptions = {
    concatTextContent: false
};

function convertValueTypeToString(value) {

    if (typeof value === 'string') { // Common case can be fasttracked
        return value;
    }

    if (value === null || value === undefined) {
        return '';
    }

    return '' + value;
}

function concatenateStringChildren(accum, value) {
    if (isRawType(value) && accum.length &&
        isRawType(accum[accum.length - 1]))
    {
        accum[accum.length - 1] = convertValueTypeToString(accum[accum.length - 1]) + convertValueTypeToString(value);
        return accum;
    }
    accum.push(value);
    return accum;
}


class ReactElementAdapter {

    constructor(options) {
        this._options = ObjectAssign({}, DefaultOptions, options);
    }

    getName(element) {
        if (typeof element.type === 'string') {
            return element.type;
        }

        return element.type.displayName || element.type.name || 'no-display-name';
    }

    getAttributes(element) {

        var realProps = {};
        if (element.props) {
            for (var key in element.props) {
                if (key !== 'children') {
                    realProps[key] = element.props[key];
                }
            }
        }

        if (this._options.includeKeyProp && element.key) {
            realProps.key = element.key;
        }

        if (this._options.includeRefProp && element.ref) {
            realProps.ref = element.ref;
        }

        return realProps;
    }

    getChildren(element) {

        var childrenArray = [];
        React.Children.forEach(element.props.children, function (child) {
            if (child !== null) {
                childrenArray.push(child);
            }
        });

        if (this._options.convertToString) {
            childrenArray = childrenArray.reduce((agg, child) => {
                if (child !== null && child !== undefined && isRawType(child)) {
                    child = convertValueTypeToString(child);
                }
                agg.push(child);
                return agg;
            }, []);
            console.log(childrenArray)
        }

        if (this._options.concatTextContent) {
            childrenArray = childrenArray.reduce(concatenateStringChildren, []);
        }

        return childrenArray;
    }

    setOptions(newOptions) {

        this._options = ObjectAssign({}, this._options, newOptions);
    }

    getOptions() {
        return this._options;
    }
}


export default ReactElementAdapter;