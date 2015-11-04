
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

    let adapter;

    beforeEach(() => {
        adapter = new ReactElementAdapter();
    });

    describe('getName()', () => {

        it('gets the name of a native component', () => {

            const component = <span />;
            expect(adapter.getName(component), 'to equal', 'span');
        });

        it('gets the name of a createClass style custom component', () => {

            const component = <TestComponent />;
            expect(adapter.getName(component), 'to equal', 'TestComponent');
        });

        it('gets the name of a class based custom component', () => {

            const component = <ClassComponent />;
            expect(adapter.getName(component), 'to equal', 'ClassComponent');
        });

        if (isReact014) {
            it('gets the name of a pure function based custom component (React >= 0.14 only)', () => {

                const component = <FuncComponent />;
                expect(adapter.getName(component), 'to equal', 'FuncComponent');
            });
        }
    });

    describe('getAttributes()', () => {

        it('gets standard string attributes', () => {

            const component = <span test1="foo" test2="bar" />;
            expect(adapter.getAttributes(component), 'to equal', {
                test1: 'foo',
                test2: 'bar'
            });
        });

        it('gets numeric attributes', () => {

            const component = <span test1={42} test2={305.12} />;
            expect(adapter.getAttributes(component), 'to equal', {
                test1: 42,
                test2: 305.12
            });
        });

        it('gets object attributes', () => {

            const component = <span test1={ { test: 'foo', num: 42 } } />;
            expect(adapter.getAttributes(component), 'to equal', {
                test1: { test: 'foo', num: 42 }
            });
        });
    });

    describe('setOptions()', () => {

        it('sets an option', () => {

            adapter.setOptions({ someOption: true });
            expect(adapter.getOptions(), 'to satisfy', { someOption: true });
        });
    });

    describe('getChildren()', () => {

        it('gets an empty array when there are no children', () => {

            const component = <span />;
            expect(adapter.getChildren(component), 'to equal', []);
        });

        it('gets an array with one string child', () => {

            const component = <span>foo</span>;
            expect(adapter.getChildren(component), 'to equal', [ 'foo' ]);
        });

        it('gets an array with one numeric child', () => {

            const component = <span>{42}</span>;
            expect(adapter.getChildren(component), 'to equal', [ 42 ]);
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
            expect(adapter.getChildren(component), 'to equal', [ <div>some text</div> ]);
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
            expect(adapter.getChildren(component), 'to equal', [
                <div>some text</div>,
                <div>foo</div>,
                <span attrib="hello world">cheese</span>
            ]);
        });

        it('does not concat text children by default', () => {

            const component = <span>Hello {42} world</span>;

            expect(adapter.getChildren(component), 'to equal', [
                'Hello ', 42, ' world'
            ]);
        });

        it('does concat text children when concatTextContent is true', () => {

            const component = <span>Hello {42} world</span>;
            adapter.setOptions({ concatTextContent: true })

            expect(adapter.getChildren(component), 'to equal', [
                'Hello 42 world'
            ]);
        });

        it('converts content to strings when `convertToString` option is true', () => {

            const component = <span>Hello {42} world</span>;
            adapter.setOptions({ convertToString: true });

            expect(adapter.getChildren(component), 'to equal', [
                'Hello ', '42', ' world'
            ]);
        });

        it('converts content with null when `convertToString` option is true', () => {

            const component = <span>Hello {null} world</span>;
            adapter.setOptions({ convertToString: true });

            expect(adapter.getChildren(component), 'to equal', [
                'Hello ', ' world'
            ]);
        });

        it('ignores the `key` attribute', () => {

            const component = <span key="abc" id="foo"></span>;

            expect(adapter.getAttributes(component), 'to equal', { id: 'foo' });
        });

        it('ignores the `ref` attribute', () => {

            const component = <span ref="abc" id="foo"></span>;

            expect(adapter.getAttributes(component), 'to equal', { id: 'foo' });
        });

        it('does not ignore the `key` attribute when includeKeyProp option is true', () => {
            adapter.setOptions({ includeKeyProp: true });

            const component = <span key="abc" id="foo"></span>;
            expect(adapter.getAttributes(component), 'to equal', { key: 'abc', id: 'foo' });
        });

        it('does not ignore the `ref` attribute when includeRefProp option is true', () => {
            adapter.setOptions({ includeRefProp: true });

            const component = <span ref="abc" id="foo"></span>;
            expect(adapter.getAttributes(component), 'to equal', { ref: 'abc', id: 'foo' });
        });
    });
});