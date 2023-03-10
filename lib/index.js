/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('mdast-util-mdx-expression').MDXFlowExpression} MDXFlowExpression
 * @typedef {import('mdast-util-mdx-expression').MDXTextExpression} MDXTextExpression
 */

/**
 * @typedef {Root | Content} Node
 *
 * @typedef Mdx1CommentNode
 * @property {'comment'} type
 * @property {string} value
 *
 * @typedef {string | number | boolean} MarkerParameterValue
 *   Value.
 *
 *   If it looks like a number (to JavaScript), it’s cast as number.
 *   The strings `true` and `false` are turned into their corresponding
 *   booleans.
 *   The empty string is also considered the `true` boolean.
 * @typedef {Record<string, MarkerParameterValue>} MarkerParameters
 *   Parameters.
 *
 * @typedef Marker
 *   Comment marker.
 * @property {string} name
 *   Name of marker.
 * @property {string} attributes
 *   Value after name.
 * @property {MarkerParameters} parameters
 *   Parsed attributes.
 * @property {HTML | Mdx1CommentNode | MDXFlowExpression | MDXTextExpression} node
 *   Reference to given node.
 */

const commentExpression = /\s*([a-zA-Z\d-]+)(\s+([\s\S]*))?\s*/
const esCommentExpression = new RegExp(
  '(\\s*\\/\\*' + commentExpression.source + '\\*\\/\\s*)'
)
const markerExpression = new RegExp(
  '(\\s*<!--' + commentExpression.source + '-->\\s*)'
)

// To do: next major: replace `null` with `undefined` in API output.
/**
 * Parse a comment marker.
 *
 * @param {unknown} value
 *   Thing to parse, typically `Node`.
 * @returns {Marker | null}
 *   Info when applicable or `null`.
 */
export function commentMarker(value) {
  if (
    isNode(value) &&
    (value.type === 'html' ||
      // @ts-expect-error: MDX@1
      value.type === 'comment' ||
      value.type === 'mdxFlowExpression' ||
      value.type === 'mdxTextExpression')
  ) {
    let offset = 2
    /** @type {RegExpMatchArray | null | undefined} */
    let match

    // @ts-expect-error: MDX@1
    if (value.type === 'comment') {
      // @ts-expect-error: MDX@1
      match = value.value.match(commentExpression)
      offset = 1
    } else if (value.type === 'html') {
      match = value.value.match(markerExpression)
    } else if (
      value.type === 'mdxFlowExpression' ||
      value.type === 'mdxTextExpression'
    ) {
      match = value.value.match(esCommentExpression)
    }

    if (match && match[0].length === value.value.length) {
      const parameters = parseParameters(match[offset + 1] || '')

      if (parameters) {
        return {
          name: match[offset],
          attributes: (match[offset + 2] || '').trim(),
          parameters,
          node: value
        }
      }
    }
  }

  return null
}

/**
 * Parse a string of “attributes”.
 *
 * @param {string} value
 *   Attributes.
 * @returns {MarkerParameters | null}
 *   Parameters.
 */
function parseParameters(value) {
  /** @type {MarkerParameters} */
  const parameters = {}

  return value
    .replace(
      /\s+([-\w]+)(?:=(?:"((?:\\[\s\S]|[^"])*)"|'((?:\\[\s\S]|[^'])*)'|((?:\\[\s\S]|[^"'\s])+)))?/gi,
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
   * @returns {string}
   */
  // eslint-disable-next-line max-params
  function replacer(_, $1, $2, $3, $4) {
    /** @type {MarkerParameterValue} */

    let value = $2 === undefined ? ($3 === undefined ? $4 : $3) : $2
    const number = Number(value)

    if (value === 'true' || value === undefined) {
      value = true
    } else if (value === 'false') {
      value = false
    } else if (value.trim() && !Number.isNaN(number)) {
      value = number
    }

    parameters[$1] = value

    return ''
  }
}

/**
 * Check if something looks like a node.
 *
 * @param {unknown} value
 *   Thing.
 * @returns {value is Node}
 *   It’s a node!
 */
function isNode(value) {
  return Boolean(value && typeof value === 'object' && 'type' in value)
}
