import test from 'tape'
import {commentMarker} from './index.js'

test('commentMaker(node)', function (t) {
  var node

  t.equal(commentMarker(), null, 'should work without node')

  t.equal(
    commentMarker({type: 'paragraph', children: []}),
    null,
    'should work without html node'
  )

  t.equal(
    commentMarker({type: 'html', value: '<div></div>'}),
    null,
    'should work without comment'
  )

  t.equal(
    commentMarker({type: 'html', value: '<!-- -->'}),
    null,
    'should work for empty comments'
  )

  t.equal(
    commentMarker({type: 'html', value: '<!--foo-->this is something else.'}),
    null,
    'should work for partial comments'
  )

  node = {type: 'html', value: '<!--foo-->'}

  t.deepEqual(
    commentMarker(node),
    {name: 'foo', attributes: '', parameters: {}, node},
    'marker without attributes'
  )

  node = {type: 'html', value: '<!-- foo -->'}

  t.deepEqual(
    commentMarker(node),
    {name: 'foo', attributes: '', parameters: {}, node},
    'marker without attributes ignoring spaces'
  )

  node = {type: 'html', value: '<!--foo bar-->'}

  t.deepEqual(
    commentMarker(node),
    {name: 'foo', attributes: 'bar', parameters: {bar: true}, node},
    'marker with boolean attributes'
  )

  node = {type: 'html', value: '<!--foo bar=baz qux-->'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar=baz qux',
      parameters: {bar: 'baz', qux: true},
      node
    },
    'marker with unquoted attributes'
  )

  node = {type: 'html', value: '<!--foo bar="baz qux"-->'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar="baz qux"',
      parameters: {bar: 'baz qux'},
      node
    },
    'marker with double quoted attributes'
  )

  node = {type: 'html', value: "<!--foo bar='baz qux'-->"}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: "bar='baz qux'",
      parameters: {bar: 'baz qux'},
      node
    },
    'marker with single quoted attributes'
  )

  node = {type: 'html', value: '<!--foo bar=3-->'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar=3',
      parameters: {bar: 3},
      node
    },
    'marker with numbers'
  )

  node = {type: 'html', value: '<!--foo bar=true-->'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar=true',
      parameters: {bar: true},
      node
    },
    'marker with boolean true'
  )

  node = {type: 'html', value: '<!--foo bar=false-->'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar=false',
      parameters: {bar: false},
      node
    },
    'marker with boolean false'
  )

  t.equal(
    commentMarker({type: 'html', value: '<!--foo bar=-->'}),
    null,
    'marker stop for invalid parameters (#1)'
  )

  t.equal(
    commentMarker({type: 'html', value: '<!--foo bar= qux-->'}),
    null,
    'marker stop for invalid parameters (#2)'
  )

  t.equal(
    commentMarker({type: 'html', value: '<!--foo |-->'}),
    null,
    'marker stop for invalid parameters (#3)'
  )

  t.end()
})

test('comment node', function (t) {
  var node

  t.equal(
    commentMarker({type: 'comment', value: ' '}),
    null,
    'should work for empty comments'
  )

  node = {type: 'comment', value: 'foo'}

  t.deepEqual(
    commentMarker(node),
    {name: 'foo', attributes: '', parameters: {}, node},
    'comment without attributes'
  )

  node = {type: 'comment', value: ' foo '}

  t.deepEqual(
    commentMarker(node),
    {name: 'foo', attributes: '', parameters: {}, node},
    'comment without attributes ignoring spaces'
  )

  node = {type: 'comment', value: 'foo bar'}

  t.deepEqual(
    commentMarker(node),
    {name: 'foo', attributes: 'bar', parameters: {bar: true}, node},
    'comment with boolean attributes'
  )

  node = {type: 'comment', value: 'foo bar=baz qux'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar=baz qux',
      parameters: {bar: 'baz', qux: true},
      node
    },
    'comment with unquoted attributes'
  )

  node = {type: 'comment', value: 'foo bar="baz qux"'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar="baz qux"',
      parameters: {bar: 'baz qux'},
      node
    },
    'comment with double quoted attributes'
  )

  node = {type: 'comment', value: "foo bar='baz qux'"}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: "bar='baz qux'",
      parameters: {bar: 'baz qux'},
      node
    },
    'comment with single quoted attributes'
  )

  node = {type: 'comment', value: 'foo bar=3'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar=3',
      parameters: {bar: 3},
      node
    },
    'comment with numbers'
  )

  node = {type: 'comment', value: 'foo bar=true'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar=true',
      parameters: {bar: true},
      node
    },
    'comment with boolean true'
  )

  node = {type: 'comment', value: 'foo bar=false'}

  t.deepEqual(
    commentMarker(node),
    {
      name: 'foo',
      attributes: 'bar=false',
      parameters: {bar: false},
      node
    },
    'comment with boolean false'
  )

  t.equal(
    commentMarker({type: 'comment', value: 'foo bar='}),
    null,
    'marker stop for invalid parameters (#1)'
  )

  t.equal(
    commentMarker({type: 'comment', value: 'foo bar= qux'}),
    null,
    'marker stop for invalid parameters (#2)'
  )

  t.equal(
    commentMarker({type: 'comment', value: 'foo |'}),
    null,
    'marker stop for invalid parameters (#3)'
  )

  t.end()
})
