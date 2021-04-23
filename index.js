var commentExpression = /\s*([a-zA-Z\d-]+)(\s+([\s\S]*))?\s*/

var markerExpression = new RegExp(
  '(\\s*<!--' + commentExpression.source + '-->\\s*)'
)

// Parse a comment marker.
export function commentMarker(node) {
  var match
  var offset
  var parameters

  if (node && (node.type === 'html' || node.type === 'comment')) {
    match = node.value.match(
      node.type === 'comment' ? commentExpression : markerExpression
    )

    if (match && match[0].length === node.value.length) {
      offset = node.type === 'comment' ? 1 : 2
      parameters = parseParameters(match[offset + 1] || '')

      if (parameters) {
        return {
          name: match[offset],
          attributes: match[offset + 2] || '',
          parameters,
          node
        }
      }
    }
  }

  return null
}

// Parse `value` into an object.
function parseParameters(value) {
  var parameters = {}

  return value
    .replace(
      /\s+([-\w]+)(?:=(?:"((?:\\[\s\S]|[^"])+)"|'((?:\\[\s\S]|[^'])+)'|((?:\\[\s\S]|[^"'\s])+)))?/gi,
      replacer
    )
    .replace(/\s+/g, '')
    ? null
    : parameters

  // eslint-disable-next-line max-params
  function replacer($0, $1, $2, $3, $4) {
    var value = $2 || $3 || $4 || ''

    if (value === 'true' || value === '') {
      value = true
    } else if (value === 'false') {
      value = false
    } else if (!Number.isNaN(Number(value))) {
      value = Number(value)
    }

    parameters[$1] = value

    return ''
  }
}
