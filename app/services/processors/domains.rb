# frozen_string_literal: true

module Processors
  ###
  # @description: This class will handle the tasks related to domains,
  #   which represents concepts.
  #
  #   E.g. "Person", "Organization", "Course"
  #
  #   One of the main tasks of this class will be to handle the existence
  #   of the domains by reading a skos file placed in a fixed directory in
  #   the project, called 'concepts'.
  ###
  class Domains < Skos
    include Validatable

    ###
    # @description: Process a given file which must contain json data, to
    #   create domains and domain sets into the db.
    ###
    def create
      @domain_set = create_domain_set
      create_domains

      @domain_set
    end

    ###
    # @description: Process a given concept scheme (domain set) to create it
    #   if necessary
    # @return [DomainSet]
    ###
    def create_domain_set
      domain_set = first_concept_scheme_node
      parser = Parsers::JsonLd::Node.new(domain_set)

      DomainSet.create!(
        creator: parser.read!("creator"),
        description: parser.read!("description"),
        source_uri: parser.read!("id"),
        title: parser.read!("title") || parser.read!("label")
      )
    end

    ###
    # @description: Process a given set of domains
    ###
    def create_domains
      @concept_nodes.each do |domain|
        parser = Parsers::JsonLd::Node.new(domain)

        @domain_set
          .domains
          .create_with(
            definition: parser.read!("definition"),
            pref_label: parser.read!("prefLabel")
          )
          .find_or_create_by!(source_uri: parser.read!("id"))
      end
    end
  end
end
