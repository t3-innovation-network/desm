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
  if (_.isString(vocab)) vocab = JSON.parse(vocab);

  let errors = [];

  let hasContext = vocab["@context"];
  let hasGraph = vocab["@graph"];
  let hasMainNode = hasGraph && graphMainNode(vocab["@graph"]);
  let hasConcepts =
    hasGraph &&
    vocab["@graph"].some(
      (node) => nodeType(node).toLowerCase() === "skos:concept"
    );

  if (!hasContext) errors.push("Missing context.");
  if (!hasGraph) errors.push("Missing graph.");
  if (!hasMainNode) errors.push("Missing concept scheme node.");
  if (!hasConcepts) errors.push("Missing concept nodes");

  return {
    errors: errors,
    result: hasContext && hasGraph && hasMainNode && hasConcepts,
  };
};

/**
 * The number of concepts inside
 * @param {Object} vocab
 */
export const cantConcepts = (vocab) => {
  return vocab["@graph"].map(
    (node) => nodeType(node).toLowerCase() === "skos:concept"
  ).length;
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
 * Return the content of the node type attribute
 *
 * @param {Object} node
 * @returns String
 */
const nodeType = (node) => {
  return node["type"] || node["@type"];
};
