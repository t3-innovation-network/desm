/**
 * Generate a name for the vocabulary
 *
 * @param {Array} graph a list of nodes.
 */
export const vocabName = (graph) => {
  let schemeNode = graph.find((node) => {
    let typeAttribute = node["type"] || node["@type"];
    return typeAttribute.toLowerCase() === "skos:conceptscheme";
  });

  if (!schemeNode) {
    throw "ConceptScheme node not found!"
  }

  let name = "";

  /// Look for an attribute with a name for the vocabulary in the concept scheme node
  for(let attr in schemeNode) {
    if(attr.toLowerCase().includes("title") || attr.toLowerCase().includes("label")){
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
  if (_.isString(node[attr])) return node[attr]

  /// We are reading an attribute that contains the words "title" or "label", but it's
  /// not a String. It contains one more level of nesting.  It can be the i18n management:
  /// "en-US": "a description", or "en-us": "a description" (lowercased).
  ///
  /// So our solution is to read the its attributes by using recursion, until one gives
  /// us a string.
  if (_.isObject(node[attr])) {
    for(let a in node[attr]) {
      return readNodeAttribute(node[attr], a);
    }
  }

  /// If it's an array, return the first element assuming it's a string. If it
  /// is not a string, just return an empty string.
  if(_.isArray(node[attr])) {
    [firstNode] = node[attr];
    return _.isString(firstNode) ? firstNode : "";
  }
}