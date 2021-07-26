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
 * @param {unknown} node
 * @returns {Marker|null}
 */
export function commentMarker(node) {
  if (
    node &&
    typeof node === 'object' &&
    // @ts-ignore hush
    (node.type === 'html' || node.type === 'comment')
  ) {
    // @ts-ignore hush
    const match = node.value.match(
      // @ts-ignore hush
      node.type === 'comment' ? commentExpression : markerExpression
    )

    // @ts-ignore hush
    if (match && match[0].length === node.value.length) {
      // @ts-ignore hush
      const offset = node.type === 'comment' ? 1 : 2
      const parameters = parseParameters(match[offset + 1] || '')

      if (parameters) {
        return {
          name: match[offset],
          attributes: match[offset + 2] || '',
          parameters,
          // @ts-ignore hush
          node
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
