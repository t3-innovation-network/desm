import { isString, isEmpty, isNull, isObject, isArray } from 'lodash';

const versionedName = (vocab) => {
  if (vocab.version === 1) return vocab.name;
  return `${vocab.name} (${vocab.version})`;
};

/**
 * Get or generate a name for the vocabulary
 *
 * @param {Object} vocab containing vocab data.
 * @param {Number} version (optional) to return a versioned name.
 * @returns {String} the name of the vocabulary.
 */
export const vocabName = (vocab, version = null) => {
  // data will be returned from the backend with a name_with_version, fallback to parse from graph
  if (vocab.name_with_version) return version ? versionedName(vocab) : vocab.name;

  let schemeNode = graphMainNode(vocab['@graph']);
  if (!schemeNode) throw 'ConceptScheme node not found!';

  /// Look for an attribute with a name for the vocabulary in the concept scheme node
  let name = '';
  for (let attr in schemeNode) {
    if (attr.toLowerCase().includes('title') || attr.toLowerCase().includes('label')) {
      name = readNodeAttribute(schemeNode, attr);

      break;
    }
  }

  // TODO: move all this to backend serializer
  return !version || version === 1 ? name : `${name} (${version})`;
};

/**
 * Return the main node from a graph of a vocabulary (Returns the node of
 * type "concept scheme").
 *
 * @param {Array} graph
 */
export const graphMainNode = (graph) => {
  return graph.find((node) => {
    return nodeTypes(node).find((type) => type?.toLowerCase()?.includes('conceptscheme'));
  });
};

/**
 * Safely read the skos concept attribute.
 *
 * @param {Object} node
 * @param {String} attr
 */
export const readNodeAttribute = (node, attr) => {
  if (isNull(node)) return '';

  /// Return straight if the node itself is a String
  if (isString(node)) return node;

  let key = findNodeKey(node, attr);
  if (!key) return;

  /// Return straight if the attribute is a String
  if (isString(node[key])) return node[key];

  /// We are reading an attribute that's not a String. It contains one more
  /// levels of nesting.  It can be the i18n management:
  /// "en-US": "a description", or "en-us": "a description" (lowercased). or anything
  ///
  /// So our solution is to read the its attributes by using recursion, until one gives
  /// us a string, firstly prioritizing "@value" and "@id"
  if (isObject(node[key])) {
    /// If we recognize the "@value" key, we can return that
    if (node[key]['@value']) return readNodeAttribute(node[key], '@value');
    /// If we recognize the "@id" key, we can return that
    if (node[key]['@id']) return readNodeAttribute(node[key], '@id');

    for (let a in node[key]) {
      return readNodeAttribute(node[key], a);
    }
  }

  /// If it's an array, return the first element assuming it's a string. If it
  /// is not a string, just return an empty string.
  if (isArray(node[key])) {
    var [firstNode] = node[key];
    return isString(firstNode) ? firstNode : '';
  }
};

/**
 * Find the node key by approximation
 *
 * @param {Object} node
 * @param {String} attr
 */
const findNodeKey = (node, attr) => {
  var objectKeys = Object.keys(node).filter((k) => k.includes(attr));

  return !isEmpty(objectKeys) ? objectKeys[0] : null;
};

/**
 * Return the content of the node type attribute
 *
 * @param {Object} node
 * @returns String
 */
const nodeTypes = (node) => {
  let type = node['type'] || node['@type'];

  return isArray(type) ? type : [type];
};
