/**
 * Generate a name for the vocabulary
 *
 * @param {Array} graph a list of nodes.
 */
export const vocabName = (graph) => {
  let schemeNode = graphMainNode(graph);

  if (!schemeNode) throw "ConceptScheme node not found!";

  /// Look for an attribute with a name for the vocabulary in the concept scheme node
  let name = "";
  for (let attr in schemeNode) {
    if (
      attr.toLowerCase().includes("title") ||
      attr.toLowerCase().includes("label")
    ) {
      name = readNodeAttribute(schemeNode, attr);

      break;
    }
  }

  return name;
};

/**
 * Safely read the skos concept attribute.
 *
 * @param {Object} node
 * @param {String} attr
 */
const readNodeAttribute = (node, attr) => {
  /// Return straight if it is a String
  if (_.isString(node[attr])) return node[attr];

  /// We are reading an attribute that contains the words "title" or "label", but it's
  /// not a String. It contains one more level of nesting.  It can be the i18n management:
  /// "en-US": "a description", or "en-us": "a description" (lowercased).
  ///
  /// So our solution is to read the its attributes by using recursion, until one gives
  /// us a string.
  if (_.isObject(node[attr])) {
    for (let a in node[attr]) {
      return readNodeAttribute(node[attr], a);
    }
  }

  /// If it's an array, return the first element assuming it's a string. If it
  /// is not a string, just return an empty string.
  if (_.isArray(node[attr])) {
    [firstNode] = node[attr];
    return _.isString(firstNode) ? firstNode : "";
  }
};

/**
 * Return the main node from a graph of a vocabulary (Returns the node of
 * type "concept scheme").
 *
 * @param {Array} graph
 */
export const graphMainNode = (graph) => {
  return graph.find((node) => {
    return nodeType(node).toLowerCase() === "skos:conceptscheme";
  });
};

/**
 * Return the content of the node type attribute
 *
 * @param {Object} node
 * @returns String
 */
const nodeType = (node) => {
  return node["type"] || node["@type"];
};

/**
 * Validate it's a skos file with a vocabulary inside.
 * It must have:
 * - A context
 * - A graph
 * - A main node (of type skos:ConceptScheme) inside the graph
 * - At least one concept node inside the graph
 *
 * @param {Object} vocab
 */
export const isValidVocabulary = (vocab) => {
  /// Ensure we deal with a JSON (object, not string)
  if (_.isString(vocab)) vocab = JSON.parse(vocab);

  let hasContext = vocab["@context"];
  let hasGraph = vocab["@graph"];
  let hasMainNode = hasGraph && graphMainNode(vocab["@graph"]);
  let hasConcepts =
    hasGraph &&
    vocab["@graph"].some(
      (node) => nodeType(node).toLowerCase() === "skos:concept"
    );

  return hasContext && hasGraph && hasMainNode && hasConcepts;
};
