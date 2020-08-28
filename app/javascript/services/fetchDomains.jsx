import abstractClasses from "../../../concepts/desmAbstractClasses.json"

const fetchDomains = () => {
  /// Get the domains list from the file
  let domains = abstractClasses["@graph"];

  /// The first element does not represent a domain.
  /// It's a Concept Scheme
  domains.shift();

  return domains.map((domain) => {
    /// From each domain in the list, we only need the id and the name
    /// in a simpler way
    return {
      id: domain.id,
      name: domain.prefLabel["en-us"]
    }
  })
}

export default fetchDomains;