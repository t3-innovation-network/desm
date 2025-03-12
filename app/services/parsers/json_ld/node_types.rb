# frozen_string_literal: true

module Parsers
  module JsonLd
    module NodeTypes
      ###
      # @description: All the possible classes a json-ld node can have.
      #   IMPORTANT! These are downcase here in purpose. The comparison is shorter this way.
      ###
      NODE_TYPES = {
        RDFS_CLASS: [
          "rdfs:class",
          "rdf:class",
          "http://www.w3.org/2000/01/rdf-schema#class",
          "https://www.w3.org/1999/02/22-rdf-syntax-ns#Class"
        ],
        RDF_PROPERTY: [
          "rdf:property",
          "rdfs:property",
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#property",
          "http://www.w3.org/2000/01/rdf-schema#property"
        ],
        SKOS_CONCEPT_SCHEME: [
          "skos:conceptscheme",
          "http://www.w3.org/2004/02/skos/core#conceptscheme"
        ],
        SKOS_CONCEPT: [
          "skos:concept",
          "http://www.w3.org/2004/02/skos/core#concept"
        ],
        OWL_CLASS: [
          "owl:class",
          "http://www.w3.org/2002/07/owl#class"
        ]
      }.freeze

      ###
      # @description: Determines if the provided type is already part of the fixed list of node
      #   types. If so return it.
      # @return [String,FalseClass]
      ###
      def standardized_type?(type)
        return false if type.nil?

        type if NODE_TYPES.values.flatten.include?(type.downcase)
      end
    end
  end
end
