# frozen_string_literal: true

module Processors
  ###
  # @description: This class will handle the tasks related to specifications,
  ###
  class Specifications
    ###
    # @description: Process a given file which must contain json data, to
    #   organize the domains information
    # @param [ActionDispatch::Http::UploadedFile] file The json file to be processed
    ###
    def self.process_domains_from_file(file)
      # Make the file content available as a json object
      file_content = JSON.parse(file)

      # The domains are listed under the '@graph' object, because at this
      # stage we are dealing with a json-ld file
      raise InvalidSpecification unless file_content["@graph"].present?

      domains = file_content["@graph"]

      process_domains(domains)
    end

    ###
    # @description: Process a given set of domains, we expect to process
    #   only one domain per mapping. So this will be useful to the UI in
    #   order to determine the number of domains present in the file
    #   and communicate to the user so they can determine which one to use
    #
    # @param [Array] domains The domains to be processed. It's an array of
    #   generic Objects
    ###
    def self.process_domains(domains)
      domains_in_file = []
      counter = 0
      domains.each do |domain|
        domain = domain.with_indifferent_access
        # Since we're looking for domains inside the file,
        # we only care about the nodes with type 'rdf:Class'
        next if domain[:@type] != "rdfs:Class"

        counter += 1
        label = domain["rdfs:label"]["@value"] || domain["rdfs:label"]["en-US"] || domain["rdfs:label"]

        domains_in_file << {
          id: counter,
          uri: domain[:@id],
          label: label
        }
      end

      domains_in_file.sort_by! {|d| d[:label] }
    end

    ###
    # @description: Process the file and return only the json with the nodes
    #   related to the selected domain and the related properties (to that
    #   class) and also the properties related with those last properties.
    #
    #  So we are going to return a json-ld file with the context and a graph
    #  node with only one class, all it's properties and recursively, all the
    #  related properties
    # @param [String] file: The file to be filtered
    # @param [String] uri: The identifier of the selected rdfs:Class that will be used to filter the file
    # @return [Hash] The collectio of vocabularies, if any, and the new filtered specification
    ###
    def self.filter_specification(spec, uri)
      # Make the spec content available as a json object
      spec = JSON.parse(spec) if spec.is_a?(String)

      vocabularies = filter_vocabularies(spec)
      spec = filter_specification_by_domain_uri(spec, uri)

      {
        vocabularies: vocabularies,
        specification: spec
      }
    end

    ###
    # @description: Get a collection of all the vocabularies found in the specification in a proper way
    # @param [Struct] spec: The specification to be filtered
    # @return [Array]
    ###
    def self.filter_vocabularies(spec)
      vocabs = []

      # Get all the concept scheme nodes. With the pupose of separate all the vocabularies, we
      # need the concept schemes, which represents the vocabularies main nodes.
      scheme_nodes = spec["@graph"].select {|node|
        Parsers::Specifications.read!(node, "type").is_a?(String) &&
        Parsers::Specifications.read!(node, "type").downcase == "skos:conceptscheme"
      }

      scheme_nodes.each do |scheme_node|
        # Get all the concepts for this cocept scheme
        vocab = Processors::Skos.identify_concepts(spec["@graph"], Parsers::Specifications.read!(scheme_node, "id"))

        # Place the scheme node at the beginning
        vocab.unshift(scheme_node)

        # Place the context at the beginning
        # @todo: Modify the context to be only the elements needed by the vocabulary
        # vocab.unshift(spec["@context"])

        # Add the voabulary to the list
        vocabs << vocab
      end

      vocabs
    end

    ###
    # @description: Build a specification from the one uploaded, but only
    #   with the domain selected by the user, and the related properties
    #
    # @param [Json|String] specification: The entire specification, as
    #   when the user uploaded it.
    # @param [String] domain_uri: The id (URI) of the domain selecteed by the user
    ###
    def self.filter_specification_by_domain_uri(specification, domain_uri)
      # First we need the context and an empty "@graph" which will
      # contain all the nodes of the specification
      final_spec = {
        "@context": specification["@context"],
        "@graph": []
      }

      # The first node of our graph will be the actual selected domain
      final_spec[:@graph] << specification["@graph"].find {|node| node["@id"] == domain_uri }

      # The rest of the nodes will be added recursively looking for
      # those nodes related to a URI
      final_spec[:@graph] += build_nodes_for_uri(specification["@graph"], domain_uri)

      final_spec
    end

    ###
    # @description: Recursively build all the nodes with the properties related
    #   to the domain, and the nodes related to each property.
    #
    # @param [Array] nodes The collection of all the nodes to be processed to find
    #   the related ones
    # @param [String] uri The id (URI) of the class or property to find related ones
    ###
    def self.build_nodes_for_uri(nodes, uri)
      # Find all related properties
      related_properties = nodes.select do |node|
        (
          (node["@type"] == "rdf:Property" || node["@type"] == uri) &&
          (property_of?(node, "domainIncludes", uri) || property_of?(node, "rangeIncludes", uri))
        )
      end

      # Base case
      return [] if related_properties.empty?

      related_properties.each do |prop|
        # For each of the related properties we return the prop
        # plus all its related props, recursivelly
        related_properties += build_nodes_for_uri(nodes, prop["@id"])
      end

      related_properties
    end

    ###
    # @description: See if the property is related to a given node by id (URI)
    #
    # @param [Object] node The node to be processed
    # @param [String] uri The identifier of the original node to compare
    ###
    def self.property_of?(node, related_key, uri)
      # Infer the key name by proximity
      key = node.select {|key| key.to_s.match(Regexp.new(related_key)) }.keys.first

      # Get the related nodes, one of these can be the one we're processing
      related_nodes = node[key]

      # Ensure we're dealing with array (when it's only 1 it can be a single object)
      related_nodes = [related_nodes] if related_nodes.present? && !related_nodes.is_a?(Array)

      related_nodes.present? && related_nodes.any? {|d| d["@id"] == uri || d == uri }
    end

    ###
    # @description: Create the specification with its terms
    #
    # @param [Hash] data The collection of data to create the specification
    ###
    def self.create(data)
      domain = Domain.find_by_uri(data[:domain_to])

      s = Specification.new(
        name: data[:name],
        version: data[:version],
        use_case: data[:use_case],
        user: data[:user],
        domain: domain,
        uri: "uri"
      )

      ActiveRecord::Base.transaction do
        s.save!
        create_terms(s, data[:spec])
      end

      s
    end

    ###
    # @description: Create each of the terms related to the specification
    # @param [Specification] spec The parent specification for the specs to create
    # @param [Object] spec The unified specification data uploaded by the user. It
    #   It should be json formatted string
    ###
    def self.create_terms(specification, spec)
      spec = JSON.parse(spec)

      spec["@graph"].select {|elem| elem["@type"] == "rdf:Property" }.each do |node|
        specification.terms << create_one_term(node)
      end
    end

    ###
    # @description: Handles to find or create a term with its related property
    # @param [Object] node: The node to be evaluated in order to create a term
    ###
    def self.create_one_term(node)
      # Retrieve the term, if not found, create one with these properties
      term = Term.find_or_initialize_by(uri: node["@id"], name: Parsers::Specifications.read!(node, "label"))

      unless term.property.present?
        Property.create!(
          term: term,
          uri: term.desm_uri,
          source_uri: node["@id"],
          comment: Parsers::Specifications.read!(node, "comment"),
          label: Parsers::Specifications.read!(node, "label"),
          domain: Parsers::Specifications.read(node, "domain"),
          range: Parsers::Specifications.read(node, "range"),
          subproperty_of: Parsers::Specifications.read!(node, "subproperty")
        )
      end

      term
    end
  end
end
