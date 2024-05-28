module Desm
  APP_DOMAIN = ENV['APP_DOMAIN'] || 'http://localhost:3030'
  ADMIN_ROLE_NAME = ENV['ADMIN_ROLE_NAME'] || 'Super Admin'
  MAPPER_ROLE_NAME = ENV['MAPPER_ROLE_NAME'] || 'mapper'
  CONCEPTS_DIRECTORY_PATH = 'concepts/'
  DEFAULT_PASS = ENV['DEFAULT_PASS'] || 'xZ!2Hd!cYLzS^sc%P5'
  PHONE_RE = /\A\+?[0-9 -]{6,18}\z/i
  PRIVATE_KEY = ENV['PRIVATE_KEY'] || 'BAE4QavZnymiL^c584&nBV*dxEGFzas4KXiHTz!a26##!zsHnS'
  MIN_PASSWORD_LENGTH = ENV['MIN_PASSWORD_LENGTH'] || 8
  DESM_NAMESPACE = URI("http://desmsolutions.org/ns/")

  ###
  # @description: These are for established specs used in the mapping. This block will be the same for all mapping,
  #   the prefixes an URIs are pre-existing constants.
  ###
  CONTEXT = {
    ceds: "http://desmsolutions.org/ns/ceds/",
    credReg: "http://desmsolutions.org/ns/credReg/",
    dct: "http://purl.org/dc/terms/",
    dcterms: "http://purl.org/dc/terms/",
    desm: "http://desmsolutions.org/ns/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    sdo: "http://schema.org/",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    skos: "http://www.w3.org/2004/02/skos/core#",
    "desm:inTermMapping": {
      "@type": "@id"
    },
    "desm:mapper": {
      "@type": "@id"
    },
    "desm:isClassMappingOf": {
      "@type": "@id"
    },
    "desm:mappingPredicateType": {
      "@type": "@id"
    },
    "skos:inScheme": {
      "@type": "@id"
    },
    "dct:isPartOf": {
      "@type": "@id"
    },
    "desm:AbstractClass": {
      "@type": "@id"
    },
    "desm:hasProperty": {
      "@type": "@id"
    },
    "dct:creator": {
      "@type": "@id"
    },
    "desm:homepage": {
      "@type": "@id"
    }
  }.freeze
end
