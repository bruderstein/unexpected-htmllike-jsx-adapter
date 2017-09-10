
const Unexpected = require('unexpected');

const React = require('react');
const TestUtils = require('react-test-renderer/shallow');
const Immutable = require('immutable');
const ReactElementAdapter = require('../');

const expect = Unexpected.clone();


function ListEntry(props) {
  return (<p>{props.name}</p>);
}

function List(props) {
  return (<div>
    <h3>List</h3>
    {props.list.map(listItem => (<ListEntry name={listItem} key={listItem} />))}
  </div>);
}

describe('unexpected-react issue 28 - immutable components in shallow renderer', function () {
  
  let adapter;
  
  beforeEach(() => {
    adapter = new ReactElementAdapter();
  });
  
  it('captures the immutable components', function () {
    
    const renderer = TestUtils.createRenderer();
    const immutableList = Immutable.fromJS(['test1', 'test2']);
    renderer.render(<List list={immutableList} />);
  
    // This renders the following:
    //    <div>
    //     <h3>List</h3>
    //     <ListEntry key="test1" name="test1" />
    //     <ListEntry key="test2" name="test2" />
    //   </div>
    
    const content = renderer.getRenderOutput();
    const children = adapter.getChildren(content);
    
    expect(
      {
        children,
        h3: adapter.getName(children[0]),
        firstListEntryName: adapter.getName(children[1]),
        secondListEntryName: adapter.getName(children[2]),
        firstListEntryProps: adapter.getAttributes(children[1]),
        secondListEntryProps: adapter.getAttributes(children[2])
      }, 
      'to satisfy', 
      {
        children: expect.it('to have length', 3),
        h3: expect.it('to equal', 'h3'),
        firstListEntryName: expect.it('to equal', 'ListEntry'),
        secondListEntryName: expect.it('to equal', 'ListEntry'),
        firstListEntryProps: expect.it('to satisfy', { name: 'test1' }),
        secondListEntryProps: expect.it('to satisfy', { name: 'test2' }),
      });
  });
  
});
