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
  #   the project. That directory is configured by setting the environment
  #   variable called: "CONCEPTS_DIRECTORY_PATH"
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

      already_exists?(DomainSet, domain_set, print_message: true)

      DomainSet.first_or_create!({
                                   uri: domain_set[:id],
                                   title: domain_set[:title]["en-us"],
                                   description: domain_set[:description]["en-us"],
                                   creator: domain_set[:creator]["en-us"]
                                 })
    end

    ###
    # @description: Process a given set of domains
    ###
    def create_domains
      @concept_nodes.each do |domain|
        domain = domain.with_indifferent_access

        next if already_exists?(Domain, domain, print_message: true)

        Domain.create!({
                         uri: domain[:id],
                         pref_label: domain[:prefLabel]["en-us"],
                         definition: domain[:definition]["en-us"],
                         domain_set: @domain_set
                       })
      end
    end
  end
end
