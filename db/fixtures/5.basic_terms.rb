name_raw = {
  "id": "name",
  "type": "rdf:Property",
  "label": {"en": "Human-readable version of the name of a resource."},
  "domain": [
      "rdf:Property",
      "rdfs:Class"
  ],
  "range": "rdf:langString",
  "isDefinedBy": "rdfs:"
}

description_raw = {
  "id": "description",
  "type": "rdf:Property",
  "label": {"en": "Extended description of a resource."},
  "domain": [
      "rdf:Property",
      "rdfs:Class"
  ],
  "range": "rdf:langString",
  "isDefinedBy": "rdfs:"
}

Term.seed(:name, {
  name: "name",
  raw: name_raw,
  source_uri: "#{Desm::APP_DOMAIN}/resources/terms/name"
},
{
  name: "description",
  raw: description_raw,
  source_uri: "#{Desm::APP_DOMAIN}/resources/terms/description"
})
