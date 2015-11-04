# unexpected-htmllike-jsx-adapter

This is the JSX / ReactElement adapter for [unexpected-htmllike](https://github.com/bruderstein/unexpected-htmllike)

# Usage

You need to call the `create()` to create the adapter.  With the (unique) instance you get back, you can set
options (using `setOptions({ ... })`) to influence how certain things are returned to 
[unexpected-htmllike](https://github.com/bruderstein/unexpected-htmllike).  There is currently only one option, but 
that may be extended in a future version.

```js
var UnexpectedHtmlLike = require('unexpected-htmllike');
var JsxAdapter = require('unexpected-htmllike-jsx-adapter');

var adapter = JsxAdapter.create();

var jsxHtmlLike = new UnexpectedHtmlLike(adapter);

// Now you can use jsxHtmlLike.diff(...) etc

```

# Options

## setOptions(object)

Available options: 
* concatTextContent - (default `false`) set this to true, to concatenate text content items.

For example, with the following JSX
```xml
<button>
  Button was clicked {this.state.clickCount} times
</button>
```

The `<button>` will have 3 content items:

(Let's say `this.state.clickCount === 10`)

`'Button was clicked ', 10, ' times'`

If you're diffing with `unexpected-htmllike`, these 3 content items must match exactly. When setting `concatTextContent` 
to true, this would result in a single string content item

`'Button was clicked 10 times'`

The options take immediate effect, and can be changed per instance of the adapter (hence, you could, although not recommended),
set the options differently for the `actualAdapter` and the `expectedAdapter` for `unexpected-htmllike`

# License
MIT
