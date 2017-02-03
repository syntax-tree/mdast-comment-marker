# mdast-comment-marker [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status] [![Chat][chat-badge]][chat]

Parse an [MDAST][] comment marker.

## Installation

[npm][]:

```bash
npm install mdast-comment-marker
```

**mdast-comment-marker** is also available as an AMD, CommonJS, and
globals module, [uncompressed and compressed][releases].

## Usage

```javascript
var marker = require('mdast-comment-marker');

var result = marker({
  type: 'html',
  value: '<!--foo-->'
});
```

Yields:

```json
{
  "name": "foo",
  "attributes": "",
  "parameters": {},
  "node": {
    "type": "html",
    "value": "<!--foo-->"
  }
}
```

Parameters:

```javascript
result = marker({
  type: 'html',
  value: '<!--foo bar baz=12.4 qux="test test" quux=\'false\'-->'
});
```

Yields:

```json
{
  "name": "foo",
  "attributes": "bar baz=12.4 qux=\"test test\" quux='false'",
  "parameters": {
    "bar": true,
    "baz": 12.4,
    "qux": "test test",
    "quux": false
  },
  "node": {
    "type": "html",
    "value": "<!--foo bar baz=12.4 qux=\"test test\" quux='false'-->"
  }
}
```

Non-markers:

```javascript
result = marker({
  type: 'html',
  value: '<!doctype html>'
});
```

Yields:

```json
null
```

## API

### `marker(node)`

Parse a comment marker.

###### Parameters

*   `node` ([`Node`][node]) — Node to parse

###### Returns

[`Marker?`][marker] — Information, when applicable.

### `Marker`

A comment marker.

###### Properties

*   `name` (`string`) — Name of marker;
*   `attributes` (`string`) — Value after name;
*   `parameters` (`Object`) — Parsed attributes, tries to convert
    values to numbers and booleans when possible;
*   `node` ([`Node`][node]) — Reference to given node.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/mdast-comment-marker.svg

[build-status]: https://travis-ci.org/syntax-tree/mdast-comment-marker

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-comment-marker.svg

[coverage-status]: https://codecov.io/github/syntax-tree/mdast-comment-marker

[chat-badge]: https://img.shields.io/gitter/room/wooorm/remark.svg

[chat]: https://gitter.im/wooorm/remark

[releases]: https://github.com/syntax-tree/mdast-comment-marker/releases

[license]: LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[mdast]: https://github.com/syntax-tree/mdast

[node]: https://github.com/syntax-tree/unist#node

[marker]: #marker
