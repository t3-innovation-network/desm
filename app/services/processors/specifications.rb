# frozen_string_literal: true

module Processors
  ###
  # @description: This class will handle the tasks related to specifications
  ###
  class Specifications
    attr_accessor :context, :graph

    def initialize file_content
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
      @current_user = data[:user]
      @scheme = data[:scheme]

      @instance = Specification.new(
        name: data[:name],
        version: data[:version],
        use_case: data[:use_case],
        user: @current_user,
        domain: Domain.find(data[:domain_id]),
        selected_domains_from_file: data[:selected_domains],
        uri: "uri" # the uri is generated in the model
      )

      ActiveRecord::Base.transaction do
        @instance.save!
        new(data[:spec]).create_terms(@instance)
      end

      @instance
    end

    ###
    # @description: Create each of the terms related to the specification
    # @param instance [Specification]
    ###
    def create_terms instance
      filter_properties(instance.selected_domains_from_file).each do |node|
        instance.terms << create_one_term(instance, node)
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
      domains = processor.graph.filter_map {|node|
        Parsers::JsonLd::Node.new(node, processor.context).rdfs_class_node
      }

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

      domains_in_file.sort_by! {|d| d[:label] }.uniq {|d| d[:uri] }
    end

    ###
    # @description: Get a collection of all the vocabularies found in the specification in a proper way
    # @param [Struct] spec: The specification to be filtered
    # @return [Array]
    ###
    def filter_vocabularies
      vocabs = []

      parser = Parsers::Skos.new(context: @context, graph: @graph)

      # Get all the concept scheme nodes. With the pupose of separate all the vocabularies, we
      # need the concept schemes, which represents the vocabularies main nodes.
      parser.scheme_nodes.each {|scheme_node|
        vocabs << parser.build_vocabulary(scheme_node)
      }

      vocabs
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
      final_spec[:@graph].uniq! {|node|
        [node["id"], node["@id"]]
      }&.sort_by! {|node|
        Parsers::JsonLd::Node.new(node).read!("label") ? 1 : 0
      }

      # Return the specification, since the above statement ends in 'sort' which doesn't returns the specification as
      # we need.
      final_spec
    end

    ###
    # @description: Put together the content of the uploaded files to get only one object with
    #   all the necessary data to process
    # @return [Object]: The unified specification
    ###
    def self.merge_specs specs
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
    def generate_nodes domain_uris
      # The first node/s of our graph will be the ones from the uris selected by the user
      final_graph = filter_classes.select {|node|
        domain_uris.any? {|uri| Parsers::JsonLd::Node.new(node).read!("id").eql?(uri) }
      }

      # The rest of the nodes will be added recursively looking for
      # those nodes related to a URI
      domain_uris.each {|domain_uri|
        final_graph += build_nodes_for_uri(domain_uri)
      }

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
        (
          parser.related_to_node_by?("domain", class_uri) ||
          parser.related_to_node_by?("range", class_uri) ||
          parser.types.eql_to?(class_uri)
        )
      end
    end

    ###
    # @description: Filter a given graph to return a new one containing only classes
    # @return [Array]
    ###
    def filter_classes
      @graph.select {|node|
        Parsers::JsonLd::Node.new(node, {}).types.rdfs_class?
      }
    end

    ###
    # @description: Filter a given graph to return a new one containing only properties
    #   or elements of a given class
    #
    # @param [Array] class_uris
    # @return [TrueClass|FalseClass]:
    ###
    def filter_properties class_uris=[], nodes=nil
      nodes ||= @graph

      nodes.select do |node|
        (parser = Parsers::JsonLd::Node.new(node, @context)) &&
        (parser.types.rdf_property? || (class_uris&.any? {|class_uri| parser.types.eql_to?(class_uri) }))
      end
    end

    ###
    # @description: Handles to find or create a term with its related property
    # @param instance [Specification]
    # @param [Object] node: The node to be evaluated in order to create a term
    ###
    def create_one_term(instance, node)
      parser = Parsers::JsonLd::Node.new(node)
      # Retrieve the term, if not found, create one with these properties
      Term.find_or_initialize_by(uri: parser.read!("id")) do |t|
        t.update!(
          name: parser.read!("label") || parser.read!("id"),
          organization: instance.user.organization
        )
        create_property_term(t, node)
      end
    end

    ###
    # @description: Creates a property if not found for the provided term
    # @param [Term] term
    # @param [Hash] node
    ###
    def create_property_term term, node
      return if term.property.present?

      parser = Parsers::JsonLd::Node.new(node)
      domain = parser.read_as_array("domain")
      range = parser.read_as_array("range")

      Property.create!(
        term: term,
        uri: term.desm_uri,
        source_uri: parser.read!("id"),
        comment: parser.read!("comment"),
        label: parser.read!("label") || parser.read!("id"),
        domain: domain,
        selected_domain: domain&.first,
        range: range&.first,
        subproperty_of: parser.read!("subproperty"),
        scheme: @scheme
      )
    end
  end
end
