# mdast-comment-marker [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Parse a comment marker in [mdast][mdast].

## Installation

[npm][npm-install]:

```bash
npm install mdast-comment-marker
```

**mdast-comment-marker** is also available for [duo][duo-install], and as an
AMD, CommonJS, and globals module, [uncompressed and compressed][releases].

## Usage

```javascript
var remark = require('remark');
var marker = require('mdast-comment-marker');
```

A simple marker:

```javascript
var result = marker({
    'type': 'html',
    'value': '<!--foo-->'
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
    'type': 'html',
    'value': '<!--foo bar baz=12.4 qux="test test" quux=\'false\'-->'
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
    'type': 'html',
    'value': '<!doctype html>'
});
```

Yields:

```json
null
```

## API

### `marker(node)`

Parse a comment marker.

**Parameters**

*   `node` ([`Node`][mdast-node]) — Node to parse;

**Returns**: `Marker?` — Information, when applicable.

### `Marker`

A marker.

**Properties**

*   `name` (`string`) — Name of marker;

*   `attributes` (`string`) — Value after name;

*   `parameters` (`Object`) — Parsed attributes, tries to convert
    values to numbers and booleans when possible;

*   `node` ([`Node`][mdast-node]) — Reference to given node.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/mdast-comment-marker.svg

[travis]: https://travis-ci.org/wooorm/mdast-comment-marker

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/mdast-comment-marker.svg

[codecov]: https://codecov.io/github/wooorm/mdast-comment-marker

[npm-install]: https://docs.npmjs.com/cli/install

[duo-install]: http://duojs.org/#getting-started

[releases]: https://github.com/wooorm/mdast-comment-marker/releases

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/wooorm/mdast

[mdast-node]: https://github.com/wooorm/mdast#node
