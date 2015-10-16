
import React from 'react';
import Unexpected from 'unexpected';

import ReactElementAdapter from '../';
const expect = Unexpected.clone();

const versionParts = React.version.split('.');
const isReact014 = (parseFloat(versionParts[0] + '.' + versionParts[1]) >= 0.14);

const TestComponent = React.createClass({

    render() {
        return null;
    }
});

class ClassComponent extends React.Component {

    render() {
        return null;
    }
}

function FuncComponent(props) {

    return null;
}

describe('ReactElementAdapter', () => {

    describe('getName()', () => {

        it('gets the name of a native component', () => {

            const component = <span />;
            expect(ReactElementAdapter.getName(component), 'to equal', 'span');
        });

        it('gets the name of a createClass style custom component', () => {

            const component = <TestComponent />;
            expect(ReactElementAdapter.getName(component), 'to equal', 'TestComponent');
        });

        it('gets the name of a class based custom component', () => {

            const component = <ClassComponent />;
            expect(ReactElementAdapter.getName(component), 'to equal', 'ClassComponent');
        });

        if (isReact014) {
            it('gets the name of a pure function based custom component (React >= 0.14 only)', () => {

                const component = <FuncComponent />;
                expect(ReactElementAdapter.getName(component), 'to equal', 'FuncComponent');
            });
        }
    });

    describe('getAttributes()', () => {

        it('gets standard string attributes', () => {

            const component = <span test1="foo" test2="bar" />;
            expect(ReactElementAdapter.getAttributes(component), 'to equal', {
                test1: 'foo',
                test2: 'bar'
            });
        });

        it('gets numeric attributes', () => {

            const component = <span test1={42} test2={305.12} />;
            expect(ReactElementAdapter.getAttributes(component), 'to equal', {
                test1: 42,
                test2: 305.12
            });
        });

        it('gets object attributes', () => {

            const component = <span test1={ { test: 'foo', num: 42 } } />;
            expect(ReactElementAdapter.getAttributes(component), 'to equal', {
                test1: { test: 'foo', num: 42 }
            });
        });
    });

    describe('getChildren()', () => {

        it('gets an empty array when there are no children', () => {

            const component = <span />;
            expect(ReactElementAdapter.getChildren(component), 'to equal', []);
        });

        it('gets an array with one string child', () => {

            const component = <span>foo</span>;
            expect(ReactElementAdapter.getChildren(component), 'to equal', [ 'foo' ]);
        });

        it('gets an array with one numeric child', () => {

            const component = <span>{42}</span>;
            expect(ReactElementAdapter.getChildren(component), 'to equal', [ 42 ]);
        });

        it('gets an array with a component child', () => {

            // Here's where I'd really like to use unexpected-react-shallow, but as that may require
            // this package at some point, we'll just live with rubbish error messages and the security
            // that we're not in an endless self-congratulatory-testing loop
            const component = (
                <span>
                    <div>some text</div>
                </span>
            );
            expect(ReactElementAdapter.getChildren(component), 'to equal', [ <div>some text</div> ]);
        });

        it('gets an array with several component children', () => {

            // Here's where I'd really like to use unexpected-react-shallow, but as that may require
            // this package at some point, we'll just live with rubbish error messages and the security
            // that we're not in an endless self-congratulatory-testing loop
            const component = (
                <span>
                    <div>some text</div>
                    <div>foo</div>
                    <span attrib="hello world">cheese</span>
                </span>
            );
            expect(ReactElementAdapter.getChildren(component), 'to equal', [
                <div>some text</div>,
                <div>foo</div>,
                <span attrib="hello world">cheese</span>
            ]);
        });
    });
});