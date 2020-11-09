import React from "react";

const rawTerm = (term) => {
  return {
    "@id": term.property.uri,
    "@type": "rdf:Property",
    "desm:sourceURI": {
      "@id": term.property.source_uri
    },
    "rdfs:subPropertyOf": {
      "@id": term.property.subproperty_of
    },
    "desm:valueSpace": {
      "@id": term.property.value_space
    },
    "rdfs:label": term.property.label,
    "rdfs:comment": term.property.comment,
    "rdfs:domain": term.property.domain,
    "rdfs:range": term.property.range
  }
}

export default rawTerm;