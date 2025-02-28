# frozen_string_literal: true

module Processors
  ###
  # @description: This class will handle the tasks related to specifications
  ###
  class Specifications
    attr_accessor :context, :graph

    def initialize(file_content)
      file_content = JSON.parse(file_content) if file_content.is_a?(String)
      file_content = file_content.with_indifferent_access

      # The domains are listed under the '@graph' object, because at this
      # stage we are dealing with a json-ld file
      raise InvalidSpecification unless file_content["@graph"].present?

      @spec = file_content
      @context = file_content["@context"] || {}
      @graph = file_content["@graph"]
    end

    ###
    # @description: Create the specification with its terms
    # @param [Hash] data The collection of data to create the specification
    ###
    def self.create(data)
      @instance = Specification.new(
        configuration_profile_user: data[:configuration_profile_user],
        name: data[:name],
        version: data[:version],
        domain: Domain.find(data[:domain_id]),
        selected_domains_from_file: data[:selected_domains]
      )

      ActiveRecord::Base.transaction do
        @instance.save!
        new(data[:spec]).create_terms(@instance, data[:configuration_profile_user])
      end

      @instance
    end

    ###
    # @description: Create the specification with its terms
    # @param [Hash] data The collection of data to create the specification
    ###
    def self.update(data, instance:)
      @instance = instance

      ActiveRecord::Base.transaction do
        @instance.update!(
          name: data[:name],
          version: data[:version],
          selected_domains_from_file: @instance.selected_domains_from_file.concat(data[:selected_domains]).uniq
        )
        new(data[:spec]).create_terms(@instance, data[:configuration_profile_user])
        mapping = @instance.domain.spine.mappings.find(data[:mapping_id])
        mapping.update!(status: Mapping.statuses["uploaded"]) if mapping.ready_to_upload?
      end

      @instance
    end

    ###
    # @description: Create each of the terms related to the specification
    # @param instance [Specification]
    ###
    def create_terms(instance, configuration_profile_user)
      filter_properties(instance.selected_domains_from_file).each do |node|
        term = create_one_term(node, configuration_profile_user)
        next if term.nil? || instance.terms.include?(term)

        instance.terms << term
      end
    end

    ###
    # @description: Process the file and return only the json with the nodes
    #   related to the selected domain and the related properties (to that
    #   class) and also the properties related with those last properties.
    #
    #  So we are going to return a json-ld file with the context and a graph
    #  node with only one class, all it's properties and recursively, all the
    #  related properties
    #
    # @param [String] file: The file to be filtered
    # @param [Array] uris: The identifier of the selected rdfs:Class'es that will be used to filter the file
    # @return [Hash] The collection of vocabularies, if any, and the new filtered specification
    ###
    def self.filter_specification(spec, uris)
      processor = new(spec)
      {
        vocabularies: processor.filter_vocabularies,
        specification: processor.filter_specification_by_domain(uris)
      }
    end

    ###
    # @description: Process a given file which must contain json data, to
    #   organize the domains information
    #
    # @param [Hash] file_content The json file to be processed
    ###
    def self.process_domains_from_file(file_content)
      processor = new(file_content)
      # Since we're looking for domains inside the file,
      # we only care about the nodes with type 'rdf:Class'
      domains = processor
                  .graph
                  .filter_map do |node|
        Parsers::JsonLd::Node.new(node, processor.context).rdfs_class_nodes
      end
                  .flatten

      processor.process_domains(domains)
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
    def process_domains(domains)
      domains_in_file = []
      counter = 0

      domains.each do |domain|
        parser = Parsers::JsonLd::Node.new(domain)
        counter += 1

        domains_in_file << {
          id: counter,
          uri: parser.read!("id"),
          label: parser.read!("label") || parser.read!("id")
        }
      end

      domains_in_file.sort_by! { |d| d[:label] }.uniq { |d| d[:uri] }
    end

    ###
    # @description: Get a collection of all the vocabularies found in the specification in a proper way
    # @param [Struct] spec: The specification to be filtered
    # @return [Array]
    ###
    def filter_vocabularies
      parser = Parsers::Skos.new(context: @context, graph: @graph)

      # Get all the concept scheme nodes. With the pupose of separate all the vocabularies, we
      # need the concept schemes, which represents the vocabularies main nodes.
      parser.scheme_nodes.map do |scheme_node|
        parser.build_skos(scheme_node)
      end
    end

    ###
    # @description: Build a specification from the one uploaded, but only
    #   with the domain selected by the user, and the related properties
    #
    # @param [Array] domain_uris: The ids (URI's) of the domain/s selected by the user
    ###
    def filter_specification_by_domain(domain_uris)
      # First we need the context and an empty "@graph" which will
      # contain all the nodes of the specification
      final_spec = {
        "@context": @context,
        "@graph": generate_nodes(domain_uris)
      }

      # Avoid duplicate nodes
      final_spec[:@graph].uniq! { |node| [node["id"], node["@id"]] }&.sort_by! do |node|
        Parsers::JsonLd::Node.new(node).read!("label") ? 1 : 0
      end

      # Return the specification, since the above statement ends in 'sort' which doesn't returns the specification as
      # we need.
      final_spec
    end

    ###
    # @description: Put together the content of the uploaded files to get only one object with
    #   all the necessary data to process
    # @return [Object]: The unified specification
    ###
    def self.merge_specs(specs)
      final_spec = {
        "@context": {},
        "@graph": []
      }.with_indifferent_access

      specs.each do |spec|
        parser = Parsers::Specification.from_file(spec)

        # merge the context so we have all the context info
        final_spec[:@context].merge!(parser.context)

        # merge the graph so we have all the elements in one place
        final_spec[:@graph] += parser.graph
      end

      final_spec
    end

    private

    ###
    # @description: Fill the specification graph with all the classes and property
    #   nodes that are needed.
    #
    # @param [Array] domain_uris The ids (URI's) of the domain/s selected by the
    #   user
    # @return [Array]
    ###
    def generate_nodes(domain_uris)
      # The first node/s of our graph will be the ones from the uris selected by the user
      final_graph = filter_classes.select do |node|
        domain_uris.any? { |uri| Parsers::JsonLd::Node.new(node).read!("id").eql?(uri) }
      end

      # The rest of the nodes will be added recursively looking for
      # those nodes related to a URI
      domain_uris.each do |domain_uri|
        final_graph += build_nodes_for_uri(domain_uri)
      end

      final_graph
    end

    ###
    # @description: Recursively build all the nodes with the properties related
    #   to the domain, and the nodes related to each property.
    #
    # @param [String] class_uri The id (URI) of the class or property to find related ones
    ###
    def build_nodes_for_uri(class_uri)
      nodes = Parsers::Skos.new(graph: @graph).exclude_skos_types

      # Get only the properties
      props = filter_properties([class_uri], nodes)

      # Find all related properties
      props.select do |node|
        parser = Parsers::JsonLd::Node.new(node, @context)
        domains = parser.read!("domain").presence || parser.read!("domainIncludes")
        next class_uri == "rdfs:Resource" unless domains.present?

        parser.related_to_node_by?("domain", class_uri) ||
          parser.related_to_node_by?("domainIncludes", class_uri) ||
          parser.related_to_node_by?("dwcattributes:organizedInClass", class_uri) ||
          parser.types.eql_to?(class_uri)
      end
    end

    ###
    # @description: Filter a given graph to return a new one containing only classes
    # @return [Array]
    ###
    def filter_classes
      @graph.select do |node|
        Parsers::JsonLd::Node.new(node, {}).types.rdfs_class?
      end
    end

    ###
    # @description: Filter a given graph to return a new one containing only properties
    #   or elements of a given class
    #
    # @param [Array] class_uris
    # @return [TrueClass|FalseClass]:
    ###
    def filter_properties(class_uris = [], nodes = nil)
      nodes ||= @graph

      nodes.select do |node|
        (parser = Parsers::JsonLd::Node.new(node, @context)) &&
          (parser.types.rdf_property? || (class_uris&.any? { |class_uri| parser.types.eql_to?(class_uri) }))
      end
    end

    ###
    # @description: Handles to find or create a term with its related property
    #   Then retrieve the term, if not found, return nil
    # @param instance [Specification]
    # @param [Object] node: The node to be evaluated in order to create a term
    ###
    def create_one_term(node, configuration_profile_user)
      parser = Parsers::JsonLd::Node.new(node)
      name = parser.read!("label")

      term = configuration_profile_user
               .terms
               .find_or_initialize_by(source_uri: parser.read!("id"))

      return term if term.persisted?

      term.update!(name:, slug: name, raw: node)
      term
    end
  end
end
