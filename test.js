import assert from 'node:assert/strict'
import test from 'node:test'
import {commentMarker} from './index.js'

test('commentMaker', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'commentMarker'
    ])
  })

  await t.test('should work without node', async function () {
    assert.equal(
      // @ts-expect-error: check that the runtime handles a missing node.
      commentMarker(),
      undefined
    )
  })

  await t.test('should work without html node', async function () {
    const paragraph = {type: 'paragraph', children: []}

    assert.equal(commentMarker(paragraph), undefined)
  })

  await t.test('should work without comment', async function () {
    const html = {type: 'html', value: '<div></div>'}

    assert.equal(commentMarker(html), undefined)
  })

  await t.test('should work for empty comments', async function () {
    const html = {type: 'html', value: '<!-- -->'}

    assert.equal(commentMarker(html), undefined)
  })

  await t.test('should work for partial comments', async function () {
    const html = {type: 'html', value: '<!--foo-->this is something else.'}

    assert.equal(commentMarker(html), undefined)
  })

  await t.test('should support a marker without attributes', async function () {
    const html = {type: 'html', value: '<!--foo-->'}

    assert.deepEqual(commentMarker(html), {
      name: 'foo',
      attributes: '',
      parameters: {},
      node: html
    })
  })

  await t.test(
    'should support a marker without attributes ignoring spaces',
    async function () {
      const html = {type: 'html', value: '<!-- foo -->'}

      assert.deepEqual(commentMarker(html), {
        name: 'foo',
        attributes: '',
        parameters: {},
        node: html
      })
    }
  )

  await t.test(
    'should support a marker with boolean attributes',
    async function () {
      const html = {type: 'html', value: '<!--foo bar-->'}

      assert.deepEqual(commentMarker(html), {
        name: 'foo',
        attributes: 'bar',
        parameters: {bar: true},
        node: html
      })
    }
  )

  await t.test(
    'should support a marker with unquoted attributes',
    async function () {
      const html = {type: 'html', value: '<!--foo bar=baz qux-->'}

      assert.deepEqual(commentMarker(html), {
        name: 'foo',
        attributes: 'bar=baz qux',
        parameters: {bar: 'baz', qux: true},
        node: html
      })
    }
  )

  await t.test(
    'should support a marker with double quoted attributes',
    async function () {
      const html = {type: 'html', value: '<!--foo bar="baz qux"-->'}

      assert.deepEqual(commentMarker(html), {
        name: 'foo',
        attributes: 'bar="baz qux"',
        parameters: {bar: 'baz qux'},
        node: html
      })
    }
  )

  await t.test(
    'should support a marker with single quoted attributes',
    async function () {
      const html = {type: 'html', value: "<!--foo bar='baz qux'-->"}

      assert.deepEqual(commentMarker(html), {
        name: 'foo',
        attributes: "bar='baz qux'",
        parameters: {bar: 'baz qux'},
        node: html
      })
    }
  )

  await t.test('should support a marker with numbers', async function () {
    const html = {type: 'html', value: '<!--foo bar=3-->'}

    assert.deepEqual(commentMarker(html), {
      name: 'foo',
      attributes: 'bar=3',
      parameters: {bar: 3},
      node: html
    })
  })

  await t.test('should support a marker with boolean true', async function () {
    const html = {type: 'html', value: '<!--foo bar=true-->'}

    assert.deepEqual(commentMarker(html), {
      name: 'foo',
      attributes: 'bar=true',
      parameters: {bar: true},
      node: html
    })
  })

  await t.test('should support a marker with boolean false', async function () {
    const html = {type: 'html', value: '<!--foo bar=false-->'}

    assert.deepEqual(commentMarker(html), {
      name: 'foo',
      attributes: 'bar=false',
      parameters: {bar: false},
      node: html
    })
  })

  await t.test(
    'should support a marker stop for invalid parameters (#1)',
    async function () {
      const html = {type: 'html', value: '<!--foo bar=-->'}

      assert.equal(commentMarker(html), undefined)
    }
  )

  await t.test(
    'should support a marker stop for invalid parameters (#2)',
    async function () {
      const html = {type: 'html', value: '<!--foo bar= qux-->'}

      assert.equal(commentMarker(html), undefined)
    }
  )

  await t.test(
    'should support a marker stop for invalid parameters (#3)',
    async function () {
      const html = {type: 'html', value: '<!--foo |-->'}

      assert.equal(commentMarker(html), undefined)
    }
  )

  await t.test(
    'should support a marker with empty string attribute',
    async function () {
      const html = {type: 'html', value: '<!--foo bar="" -->'}

      assert.deepEqual(commentMarker(html), {
        name: 'foo',
        attributes: 'bar=""',
        parameters: {bar: ''},
        node: html
      })
    }
  )

  await t.test(
    'should support a marker with whitespace attribute',
    async function () {
      const html = {type: 'html', value: '<!--foo bar="  " -->'}

      assert.deepEqual(commentMarker(html), {
        name: 'foo',
        attributes: 'bar="  "',
        parameters: {bar: '  '},
        node: html
      })
    }
  )
})

test('MDX@2 expressions', async function (t) {
  await t.test('should work for comments', async function () {
    const node = {
      type: 'mdxFlowExpression',
      value: '/* lint disable heading-style */'
    }

    assert.deepEqual(commentMarker(node), {
      name: 'lint',
      attributes: 'disable heading-style',
      parameters: {disable: true, 'heading-style': true},
      node
    })
  })

  await t.test('should work for comments', async function () {
    const node = {type: 'mdxTextExpression', value: '/* lint enable */'}

    assert.deepEqual(commentMarker(node), {
      name: 'lint',
      attributes: 'enable',
      parameters: {enable: true},
      node
    })
  })
})
