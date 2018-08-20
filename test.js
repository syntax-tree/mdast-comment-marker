'use strict'

var test = require('tape')
var marker = require('.')

test('normalize(value, allowApostrophes)', function(t) {
  var node

  t.equal(marker(), null, 'should work without node')

  t.equal(
    marker({type: 'paragraph', children: []}),
    null,
    'should work without html node'
  )

  t.equal(
    marker({type: 'html', value: '<div></div>'}),
    null,
    'should work without comment'
  )

  t.equal(
    marker({type: 'html', value: '<!-- -->'}),
    null,
    'should work for empty comments'
  )

  t.equal(
    marker({type: 'html', value: '<!--foo-->this is something else.'}),
    null,
    'should work for partial comments'
  )

  node = {type: 'html', value: '<!--foo-->'}

  t.deepEqual(
    marker(node),
    {name: 'foo', attributes: '', parameters: {}, node: node},
    'marker without attributes'
  )

  node = {type: 'html', value: '<!-- foo -->'}

  t.deepEqual(
    marker(node),
    {name: 'foo', attributes: '', parameters: {}, node: node},
    'marker without attributes ignoring spaces'
  )

  node = {type: 'html', value: '<!--foo bar-->'}

  t.deepEqual(
    marker(node),
    {name: 'foo', attributes: 'bar', parameters: {bar: true}, node: node},
    'marker with boolean attributes'
  )

  node = {type: 'html', value: '<!--foo bar=baz qux-->'}

  t.deepEqual(
    marker(node),
    {
      name: 'foo',
      attributes: 'bar=baz qux',
      parameters: {bar: 'baz', qux: true},
      node: node
    },
    'marker with unquoted attributes'
  )

  node = {type: 'html', value: '<!--foo bar="baz qux"-->'}

  t.deepEqual(
    marker(node),
    {
      name: 'foo',
      attributes: 'bar="baz qux"',
      parameters: {bar: 'baz qux'},
      node: node
    },
    'marker with double quoted attributes'
  )

  node = {
    type: 'html',
    value: "<!--foo bar='baz qux'-->"
  }

  t.deepEqual(
    marker(node),
    {
      name: 'foo',
      attributes: "bar='baz qux'",
      parameters: {bar: 'baz qux'},
      node: node
    },
    'marker with single quoted attributes'
  )

  node = {type: 'html', value: '<!--foo bar=3-->'}

  t.deepEqual(
    marker(node),
    {
      name: 'foo',
      attributes: 'bar=3',
      parameters: {bar: 3},
      node: node
    },
    'marker with numbers'
  )

  node = {type: 'html', value: '<!--foo bar=true-->'}

  t.deepEqual(
    marker(node),
    {
      name: 'foo',
      attributes: 'bar=true',
      parameters: {bar: true},
      node: node
    },
    'marker with boolean true'
  )

  node = {type: 'html', value: '<!--foo bar=false-->'}

  t.deepEqual(
    marker(node),
    {
      name: 'foo',
      attributes: 'bar=false',
      parameters: {bar: false},
      node: node
    },
    'marker with boolean false'
  )

  t.equal(
    marker({type: 'html', value: '<!--foo bar=-->'}),
    null,
    'marker stop for invalid parameters (#1)'
  )

  t.equal(
    marker({type: 'html', value: '<!--foo bar= qux-->'}),
    null,
    'marker stop for invalid parameters (#2)'
  )

  t.equal(
    marker({type: 'html', value: '<!--foo |-->'}),
    null,
    'marker stop for invalid parameters (#3)'
  )

  t.end()
})
