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


function create() {

    let options = ObjectAssign({}, DefaultOptions);

    const ReactElementAdapter = {

        getName(element) {
            if (typeof element.type === 'string') {
                return element.type;
            }

            return element.type.displayName || element.type.name || 'no-display-name';
        },

        getAttributes(element) {

            var realProps = {};
            if (element.props) {
                for (var key in element.props) {
                    if (key !== 'children') {
                        realProps[key] = element.props[key];
                    }
                }
            }
            return realProps;
        },

        getChildren(element) {

            var childrenArray = [];
            React.Children.forEach(element.props.children, function (child) {
                if (child !== null) {
                    childrenArray.push(child);
                }
            });

            if (options.concatTextContent) {
                childrenArray = childrenArray.reduce(concatenateStringChildren, []);
            }

            return childrenArray;
        },

        setOptions(newOptions) {

            options = ObjectAssign({}, options, newOptions);
        },

        getOptions() {
            return options;
        }
    };

    return ReactElementAdapter;
}

export default { create };