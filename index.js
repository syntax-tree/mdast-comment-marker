/**
 * @typedef {string|number|boolean} MarkerParameterValue
 * @typedef {Object.<string, MarkerParameterValue>} MarkerParameters
 *
 * @typedef HtmlNode
 * @property {'html'} type
 * @property {string} value
 *
 * @typedef CommentNode
 * @property {'comment'} type
 * @property {string} value
 *
 * @typedef Marker
 * @property {string} name
 * @property {string} attributes
 * @property {MarkerParameters|null} parameters
 * @property {HtmlNode|CommentNode} node
 */

const commentExpression = /\s*([a-zA-Z\d-]+)(\s+([\s\S]*))?\s*/

const markerExpression = new RegExp(
  '(\\s*<!--' + commentExpression.source + '-->\\s*)'
)

/**
 * Parse a comment marker.
 * @param {unknown} value
 * @returns {Marker|null}
 */
export function commentMarker(value) {
  if (applicable(value)) {
    const match = value.value.match(
      value.type === 'comment' ? commentExpression : markerExpression
    )

    if (match && match[0].length === value.value.length) {
      const offset = value.type === 'comment' ? 1 : 2
      const parameters = parseParameters(match[offset + 1] || '')

      if (parameters) {
        return {
          name: match[offset],
          attributes: match[offset + 2] || '',
          parameters,
          node: value
        }
      }
    }
  }

  return null
}

/**
 * Parse `value` into an object.
 *
 * @param {string} value
 * @returns {MarkerParameters|null}
 */
function parseParameters(value) {
  /** @type {MarkerParameters} */
  const parameters = {}

  return value
    .replace(
      /\s+([-\w]+)(?:=(?:"((?:\\[\s\S]|[^"])+)"|'((?:\\[\s\S]|[^'])+)'|((?:\\[\s\S]|[^"'\s])+)))?/gi,
      replacer
    )
    .replace(/\s+/g, '')
    ? null
    : parameters

  /**
   * @param {string} _
   * @param {string} $1
   * @param {string} $2
   * @param {string} $3
   * @param {string} $4
   */
  // eslint-disable-next-line max-params
  function replacer(_, $1, $2, $3, $4) {
    /** @type {MarkerParameterValue} */
    let value = $2 || $3 || $4 || ''

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

/**
 * @param {unknown} value
 * @returns {value is HtmlNode | CommentNode}
 */
function applicable(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'type' in value &&
      // @ts-expect-error hush
      (value.type === 'html' || value.type === 'comment')
  )
}
