import { isString, isEmpty, isNull, isObject, isArray } from 'lodash';

/**
 * Generate a name for the vocabulary
 *
 * @param {Array} graph a list of nodes.
 */
export const vocabName = (graph) => {
  let schemeNode = graphMainNode(graph);

  if (!schemeNode) throw 'ConceptScheme node not found!';

  /// Look for an attribute with a name for the vocabulary in the concept scheme node
  let name = '';
  for (let attr in schemeNode) {
    if (attr.toLowerCase().includes('title') || attr.toLowerCase().includes('label')) {
      name = readNodeAttribute(schemeNode, attr);

      break;
    }
  }

  return name;
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
 * Validate it's a skos file with a vocabulary inside.
 * It must have:
 * - A context
 * - A graph
 * - A main node (of type skos:ConceptScheme) inside the graph
 * - At least one concept node inside the graph
 *
 * @param {String|Object} vocab
 */
export const validVocabulary = (vocab) => {
  /// Ensure we deal with a JSON (object, not string)
  if (isString(vocab)) vocab = JSON.parse(vocab);

  let errors = [];

  let hasContext = vocab['@context'];
  let hasGraph = vocab['@graph'];
  let hasMainNode = hasGraph && graphMainNode(vocab['@graph']);
  let hasConcepts =
    hasGraph &&
    vocab['@graph'].some((node) =>
      nodeTypes(node).some((type) => {
        if (!type) {
          return false;
        }

        return (
          type.toLowerCase().includes('concept') && !type.toLowerCase().includes('conceptscheme')
        );
      })
    );

  if (!hasContext) errors.push('Missing context.');
  if (!hasGraph) errors.push('Missing graph.');
  if (!hasMainNode) errors.push('Missing concept scheme node.');
  if (!hasConcepts) errors.push('Missing concept nodes');

  return {
    errors: errors,
    result: hasContext && hasGraph && hasMainNode && hasConcepts,
  };
};

/**
 * The number of concepts inside each scheme
 * @param {Object} vocab
 */
export const countConcepts = (vocab) => {
  if (isEmpty(vocab)) {
    return [];
  }

  const conceptSchemes = {};

  vocab['@graph'].forEach((node) => {
    const types = nodeTypes(node);
    let ids = [];

    if (types.some((t) => t.toLowerCase().includes('conceptscheme'))) {
      ids = [node['@id']];
    } else if (types.some((t) => t.toLowerCase().includes('concept'))) {
      ids = node['skos:inScheme'];
    }

    ids.forEach((id) => {
      if (conceptSchemes[id]) {
        conceptSchemes[id].push(node);
      } else {
        conceptSchemes[id] = [node];
      }
    });
  });

  return Object.values(conceptSchemes).map((graph) => ({
    name: vocabName(graph),
    conceptsCount: graph.length - 1,
  }));
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
