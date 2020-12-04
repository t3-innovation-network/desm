import { readNodeAttribute } from "../../helpers/Vocabularies";

/**
 * Give the concept list a proper shape to manipulate the data.
 * The backend is returning to us a list of raw concepts in json-ld
 * We need simpler names on the atrributes
 *
 * @param {Array} rawConceptList
 */
export const shapeConcepts = (rawConceptList) => {
  return rawConceptList.map((rawConcept) => {
    return {
      name: readNodeAttribute(rawConcept.raw, "prefLabel"),
      definition: readNodeAttribute(rawConcept.raw, "definition"),
      id: rawConcept["id"] || rawConcept["@id"],
    };
  });
};