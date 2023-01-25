/**
 * @typedef {import('mdast').Literal} Literal
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('mdast-util-mdx-expression').MDXFlowExpression} MDXFlowExpression
 * @typedef {import('mdast-util-mdx-expression').MDXTextExpression} MDXTextExpression
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {commentMarker} from './index.js'
import * as mod from './index.js'

test('commentMaker', () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['commentMarker'],
    'should expose the public api'
  )

  // @ts-expect-error: runtime: not enough arguments.
  assert.equal(commentMarker(), null, 'should work without node')

  /** @type {Paragraph} */
  const paragraph = {type: 'paragraph', children: []}

  assert.equal(commentMarker(paragraph), null, 'should work without html node')

  /** @type {HTML} */
  let html = {type: 'html', value: '<div></div>'}

  assert.equal(commentMarker(html), null, 'should work without comment')

  html = {type: 'html', value: '<!-- -->'}

  assert.equal(commentMarker(html), null, 'should work for empty comments')

  html = {type: 'html', value: '<!--foo-->this is something else.'}

  assert.equal(commentMarker(html), null, 'should work for partial comments')

  html = {type: 'html', value: '<!--foo-->'}

  assert.deepEqual(
    commentMarker(html),
    {name: 'foo', attributes: '', parameters: {}, node: html},
    'marker without attributes'
  )

  html = {type: 'html', value: '<!-- foo -->'}

  assert.deepEqual(
    commentMarker(html),
    {name: 'foo', attributes: '', parameters: {}, node: html},
    'marker without attributes ignoring spaces'
  )

  html = {type: 'html', value: '<!--foo bar-->'}

  assert.deepEqual(
    commentMarker(html),
    {name: 'foo', attributes: 'bar', parameters: {bar: true}, node: html},
    'marker with boolean attributes'
  )

  html = {type: 'html', value: '<!--foo bar=baz qux-->'}

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.equal(
    commentMarker(html),
    null,
    'marker stop for invalid parameters (#1)'
  )

  html = {type: 'html', value: '<!--foo bar= qux-->'}

  assert.equal(
    commentMarker(html),
    null,
    'marker stop for invalid parameters (#2)'
  )

  html = {type: 'html', value: '<!--foo |-->'}

  assert.equal(
    commentMarker(html),
    null,
    'marker stop for invalid parameters (#3)'
  )
})

test('comment node', () => {
  /** @type {Literal & {type: 'comment'}} */
  let comment = {type: 'comment', value: ' '}

  assert.equal(commentMarker(comment), null, 'should work for empty comments')

  comment = {type: 'comment', value: 'foo'}

  assert.deepEqual(
    commentMarker(comment),
    {name: 'foo', attributes: '', parameters: {}, node: comment},
    'comment without attributes'
  )

  comment = {type: 'comment', value: ' foo '}

  assert.deepEqual(
    commentMarker(comment),
    {name: 'foo', attributes: '', parameters: {}, node: comment},
    'comment without attributes ignoring spaces'
  )

  comment = {type: 'comment', value: 'foo bar'}

  assert.deepEqual(
    commentMarker(comment),
    {name: 'foo', attributes: 'bar', parameters: {bar: true}, node: comment},
    'comment with boolean attributes'
  )

  comment = {type: 'comment', value: 'foo bar=baz qux'}

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.deepEqual(
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

  assert.equal(
    commentMarker(comment),
    null,
    'marker stop for invalid parameters (#1)'
  )

  comment = {type: 'comment', value: 'foo bar= qux'}

  assert.equal(
    commentMarker(comment),
    null,
    'marker stop for invalid parameters (#2)'
  )

  comment = {type: 'comment', value: 'foo |'}

  assert.equal(
    commentMarker(comment),
    null,
    'marker stop for invalid parameters (#3)'
  )
})

test('MDX@2 expressions', () => {
  /** @type {MDXFlowExpression|MDXTextExpression} */
  let node = {
    type: 'mdxFlowExpression',
    value: '/* lint disable heading-style */'
  }

  assert.deepEqual(
    commentMarker(node),
    {
      name: 'lint',
      attributes: 'disable heading-style',
      parameters: {disable: true, 'heading-style': true},
      node
    },
    'should work for comments'
  )

  node = {type: 'mdxTextExpression', value: '/* lint enable */'}

  assert.deepEqual(
    commentMarker(node),
    {name: 'lint', attributes: 'enable', parameters: {enable: true}, node},
    'should work for comments'
  )
})
