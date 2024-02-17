const rawTerm = (term) => ({
  '@id': term.property.uri,
  '@type': 'rdf:Property',
  'desm:sourceURI': {
    '@id': term.property.sourceUri,
  },
  'rdfs:subPropertyOf': {
    '@id': term.property.subpropertyOf,
  },
  'desm:valueSpace': {
    '@id': term.property.valueSpace,
  },
  'rdfs:label': term.property.label,
  'rdfs:comment': term.property.comment,
  'rdfs:domain': term.property.domain,
  'rdfs:range': term.property.range,
});

export default rawTerm;
