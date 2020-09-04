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
        break if counter > 250
        # Since we're looking for domains inside the file,
        # we only care about the nodes with type 'rdf:Class'
        next if domain[:@type] != "rdfs:Class"

        counter += 1
        label = domain["rdfs:label"]["@value"] || domain["rdfs:label"]

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
    ###
    def self.filter_specification(file, uri)
      # Make the file content available as a json object
      specification = JSON.parse(file)

      filter_specification_by_domain_uri(specification, uri)
    end

    ###
    # @description: Build a specification from the one uploaded, but only
    #   with the domain selected by the user, and the related properties
    #
    # @param [Json|String] specification The entinre specification, as
    #   when the user uploaded it.
    # @param [String] domain_uri The id (URI) of the domain selecteed by the user
    ###
    def self.filter_specification_by_domain_uri(specification, domain_uri)
      # First we need the context and an empty "@graph" whixh will
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
    # @param [String] uri The id (URI) of the property to find related ones
    ###
    def self.build_nodes_for_uri(nodes, uri)
      # Find all related properties
      related_properties = nodes.select do |node|
        node["@type"] == "rdf:Property" && (
          property_of?(node, "http://schema.org/domainIncludes", uri) ||
          property_of?(node, "http://schema.org/rangeIncludes", uri)
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
      # Get the related nodes, one of these can be the
      # one we're processing
      related_nodes = node[related_key]

      # Ensure we're dealing with array (when it's only 1 it can be a single object)
      related_nodes = [related_nodes] if related_nodes.present? && !related_nodes.is_a?(Array)

      related_nodes.present? && related_nodes.any? {|d| d["@id"] == uri }
    end
  end
end
