/**
 * @typedef {import('mdast').Literal} Literal
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').HTML} HTML
 */

import test from 'tape'
import {commentMarker} from './index.js'

test('commentMaker(node)', (t) => {
  t.equal(commentMarker(), null, 'should work without node')

  /** @type {Paragraph} */
  const paragraph = {type: 'paragraph', children: []}

  t.equal(commentMarker(paragraph), null, 'should work without html node')

  /** @type {HTML} */
  let html = {type: 'html', value: '<div></div>'}

  t.equal(commentMarker(html), null, 'should work without comment')

  html = {type: 'html', value: '<!-- -->'}

  t.equal(commentMarker(html), null, 'should work for empty comments')

  html = {type: 'html', value: '<!--foo-->this is something else.'}

  t.equal(commentMarker(html), null, 'should work for partial comments')

  html = {type: 'html', value: '<!--foo-->'}

  t.deepEqual(
    commentMarker(html),
    {name: 'foo', attributes: '', parameters: {}, node: html},
    'marker without attributes'
  )

  html = {type: 'html', value: '<!-- foo -->'}

  t.deepEqual(
    commentMarker(html),
    {name: 'foo', attributes: '', parameters: {}, node: html},
    'marker without attributes ignoring spaces'
  )

  html = {type: 'html', value: '<!--foo bar-->'}

  t.deepEqual(
    commentMarker(html),
    {name: 'foo', attributes: 'bar', parameters: {bar: true}, node: html},
    'marker with boolean attributes'
  )

  html = {type: 'html', value: '<!--foo bar=baz qux-->'}

  t.deepEqual(
    commentMarker(html),
    {
      name: 'foo',
      attributes: 'bar=baz qux',
      parameters: {bar: 'baz', qux: true},
      node: html
    },
    'marker with unquoted attributes'
  )

  html = {type: 'html', value: '<!--foo bar="baz qux"-->'}

  t.deepEqual(
    commentMarker(html),
    {
      name: 'foo',
      attributes: 'bar="baz qux"',
      parameters: {bar: 'baz qux'},
      node: html
    },
    'marker with double quoted attributes'
  )

  html = {type: 'html', value: "<!--foo bar='baz qux'-->"}

  t.deepEqual(
    commentMarker(html),
    {
      name: 'foo',
      attributes: "bar='baz qux'",
      parameters: {bar: 'baz qux'},
      node: html
    },
    'marker with single quoted attributes'
  )

  html = {type: 'html', value: '<!--foo bar=3-->'}

  t.deepEqual(
    commentMarker(html),
    {
      name: 'foo',
      attributes: 'bar=3',
      parameters: {bar: 3},
      node: html
    },
    'marker with numbers'
  )

  html = {type: 'html', value: '<!--foo bar=true-->'}

  t.deepEqual(
    commentMarker(html),
    {
      name: 'foo',
      attributes: 'bar=true',
      parameters: {bar: true},
      node: html
    },
    'marker with boolean true'
  )

  html = {type: 'html', value: '<!--foo bar=false-->'}

  t.deepEqual(
    commentMarker(html),
    {
      name: 'foo',
      attributes: 'bar=false',
      parameters: {bar: false},
      node: html
    },
    'marker with boolean false'
  )

  html = {type: 'html', value: '<!--foo bar=-->'}

  t.equal(commentMarker(html), null, 'marker stop for invalid parameters (#1)')

  html = {type: 'html', value: '<!--foo bar= qux-->'}

  t.equal(commentMarker(html), null, 'marker stop for invalid parameters (#2)')

  html = {type: 'html', value: '<!--foo |-->'}

  t.equal(commentMarker(html), null, 'marker stop for invalid parameters (#3)')

  t.end()
})

test('comment node', (t) => {
  /** @type {Literal & {type: 'comment'}} */
  let comment = {type: 'comment', value: ' '}

  t.equal(commentMarker(comment), null, 'should work for empty comments')

  comment = {type: 'comment', value: 'foo'}

  t.deepEqual(
    commentMarker(comment),
    {name: 'foo', attributes: '', parameters: {}, node: comment},
    'comment without attributes'
  )

  comment = {type: 'comment', value: ' foo '}

  t.deepEqual(
    commentMarker(comment),
    {name: 'foo', attributes: '', parameters: {}, node: comment},
    'comment without attributes ignoring spaces'
  )

  comment = {type: 'comment', value: 'foo bar'}

  t.deepEqual(
    commentMarker(comment),
    {name: 'foo', attributes: 'bar', parameters: {bar: true}, node: comment},
    'comment with boolean attributes'
  )

  comment = {type: 'comment', value: 'foo bar=baz qux'}

  t.deepEqual(
    commentMarker(comment),
    {
      name: 'foo',
      attributes: 'bar=baz qux',
      parameters: {bar: 'baz', qux: true},
      node: comment
    },
    'comment with unquoted attributes'
  )

  comment = {type: 'comment', value: 'foo bar="baz qux"'}

  t.deepEqual(
    commentMarker(comment),
    {
      name: 'foo',
      attributes: 'bar="baz qux"',
      parameters: {bar: 'baz qux'},
      node: comment
    },
    'comment with double quoted attributes'
  )

  comment = {type: 'comment', value: "foo bar='baz qux'"}

  t.deepEqual(
    commentMarker(comment),
    {
      name: 'foo',
      attributes: "bar='baz qux'",
      parameters: {bar: 'baz qux'},
      node: comment
    },
    'comment with single quoted attributes'
  )

  comment = {type: 'comment', value: 'foo bar=3'}

  t.deepEqual(
    commentMarker(comment),
    {
      name: 'foo',
      attributes: 'bar=3',
      parameters: {bar: 3},
      node: comment
    },
    'comment with numbers'
  )

  comment = {type: 'comment', value: 'foo bar=true'}

  t.deepEqual(
    commentMarker(comment),
    {
      name: 'foo',
      attributes: 'bar=true',
      parameters: {bar: true},
      node: comment
    },
    'comment with boolean true'
  )

  comment = {type: 'comment', value: 'foo bar=false'}

  t.deepEqual(
    commentMarker(comment),
    {
      name: 'foo',
      attributes: 'bar=false',
      parameters: {bar: false},
      node: comment
    },
    'comment with boolean false'
  )

  comment = {type: 'comment', value: 'foo bar='}

  t.equal(
    commentMarker(comment),
    null,
    'marker stop for invalid parameters (#1)'
  )

  comment = {type: 'comment', value: 'foo bar= qux'}

  t.equal(
    commentMarker(comment),
    null,
    'marker stop for invalid parameters (#2)'
  )

  comment = {type: 'comment', value: 'foo |'}

  t.equal(
    commentMarker(comment),
    null,
    'marker stop for invalid parameters (#3)'
  )

  t.end()
})
