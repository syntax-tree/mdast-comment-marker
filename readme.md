# mdast-comment-marker [![Build][build-badge]][build] [![Coverage][coverage-badge]][coverage] [![Downloads][downloads-badge]][downloads] [![Chat][chat-badge]][chat]

Parse [mdast][] comment markers.

## Installation

[npm][]:

```bash
npm install mdast-comment-marker
```

## Usage

```javascript
var marker = require('mdast-comment-marker');

console.log(marker({
  type: 'html',
  value: '<!--foo-->'
}));

console.log(marker({
  type: 'html',
  value: '<!--foo bar baz=12.4 qux="test test" quux=\'false\'-->'
}));

console.log(marker({
  type: 'html',
  value: '<!doctype html>'
}));

// Also supports MDX comment nodes.
console.log(marker({
  type: 'comment',
  value: 'bar'
}));
```

Yields:

```js
{ name: 'foo',
  attributes: '',
  parameters: {},
  node: { type: 'html', value: '<!--foo-->' } }
{ name: 'foo',
  attributes: 'bar baz=12.4 qux="test test" quux=\'false\'',
  parameters: { bar: true, baz: 12.4, qux: 'test test', quux: false },
  node:
   { type: 'html',
     value: '<!--foo bar baz=12.4 qux="test test" quux=\'false\'-->' } }
null
{ name: 'bar',
  attributes: '',
  parameters: {},
  node: { type: 'comment', value: 'bar' } }
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

*   `name` (`string`) — Name of marker
*   `attributes` (`string`) — Value after name
*   `parameters` (`Object`) — Parsed attributes, tries to convert
    values to numbers and booleans when possible
*   `node` ([`Node`][node]) — Reference to given node

## Contribute

See [`contributing.md` in `syntax-tree/mdast`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/mdast-comment-marker.svg

[build]: https://travis-ci.org/syntax-tree/mdast-comment-marker

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-comment-marker.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-comment-marker

[downloads-badge]: https://img.shields.io/npm/dm/mdast-comment-marker.svg

[downloads]: https://www.npmjs.com/package/mdast-comment-marker

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[license]: license

[author]: https://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[mdast]: https://github.com/syntax-tree/mdast

[node]: https://github.com/syntax-tree/unist#node

[marker]: #marker

[contributing]: https://github.com/syntax-tree/mdast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/mdast/blob/master/code-of-conduct.md
