'use strict'

module.exports = marker

var whiteSpaceExpression = /\s+/g

// Expression for parsing parameters.
var parametersExpression = new RegExp(
  '\\s+' +
    '(' +
    '[-a-z0-9_]+' +
    ')' +
    '(?:' +
    '=' +
    '(?:' +
    '"' +
    '(' +
    '(?:' +
    '\\\\[\\s\\S]' +
    '|' +
    '[^"]' +
    ')+' +
    ')' +
    '"' +
    '|' +
    "'" +
    '(' +
    '(?:' +
    '\\\\[\\s\\S]' +
    '|' +
    "[^']" +
    ')+' +
    ')' +
    "'" +
    '|' +
    '(' +
    '(?:' +
    '\\\\[\\s\\S]' +
    '|' +
    '[^"\'\\s]' +
    ')+' +
    ')' +
    ')' +
    ')?',
  'gi'
)

var markerExpression = new RegExp(
  '(' +
    '\\s*' +
    '<!--' +
    '\\s*' +
    '([a-zA-Z0-9-]+)' +
    '(\\s+([\\s\\S]*?))?' +
    '\\s*' +
    '-->' +
    '\\s*' +
    ')'
)

// Parse a comment marker.
function marker(node) {
  var value
  var match
  var params

  if (!node || node.type !== 'html') {
    return null
  }

  value = node.value
  match = value.match(markerExpression)

  if (!match || match[1].length !== value.length) {
    return null
  }

  params = parameters(match[3] || '')

  if (!params) {
    return null
  }

  return {
    name: match[2],
    attributes: match[4] || '',
    parameters: params,
    node: node
  }
}

// Parse `value` into an object.
function parameters(value) {
  var attributes = {}
  var rest = value.replace(parametersExpression, replacer)

  return rest.replace(whiteSpaceExpression, '') ? null : attributes

  /* eslint-disable max-params */
  function replacer($0, $1, $2, $3, $4) {
    var result = $2 || $3 || $4 || ''

    if (result === 'true' || result === '') {
      result = true
    } else if (result === 'false') {
      result = false
    } else if (!isNaN(result)) {
      result = Number(result)
    }

    attributes[$1] = result

    return ''
  }
}
