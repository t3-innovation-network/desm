# frozen_string_literal: true

###
# @description: This module will handle the tasks related to domains,
#   which represents concepts.
#
#   E.g. "Person", "Organization", "Course"
#
#   One of the main tasks of this module will be to handle the existence
#   of the domains by reading a skos file placed in a fixed directory in
#   the project. That directory is configured by setting the environment
#   variable called: "CONCEPTS_DIRECTORY_PATH"
###
module DomainsHelper
  ###
  # @description: Process a given file which must contain json data, to
  #   create domains and domain sets into the db.
  # @param [File] file The already loaded json file to be processed
  ###
  def self.process_domains_from_file(file)
    file_content = JSON.parse(file)

    # The domains are listed under the '@graph' object
    domains = file_content["@graph"]

    # We want to differentiate a concept scheme, because it represents a domain set for us
    domain_set = process_domain_set(domains)

    # We need a domain set to relate all the domains to be created
    raise "Concept Scheme object not found!" unless domain_set.present?

    processed = process_domains(domains, domain_set)

    puts "#{ActionController::Base.helpers.pluralize(processed, 'domain')} processed." +
    (
      processed < 1 ? " Be sure to correctly format the file as an json-ld skos concepts file." : ""
    )
  end

  ###
  # @description: Process a given set of domains
  # @param [Array] domains The domains to be processed. It's an array of
  #   generic Objects
  # @param [DomainSet] The domain set to be assigned as a parent for each
  #   domain to be created
  ###
  def self.process_domains(domains, domain_set)
    processed = 0
    domains.each do |domain|
      domain = domain.with_indifferent_access

      # The concept scheme is processed, let's start with the proper domains
      next if domain[:type] == "skos:ConceptScheme"

      next if already_exists?(Domain, domain)

      Domain.create!({
                       uri: domain[:id],
                       pref_label: domain[:prefLabel]["en-us"],
                       definition: domain[:definition]["en-us"],
                       domain_set: domain_set
                     })

      processed += 1
    end

    processed
  end

  ###
  # @description: Validate the existence of a domain / domain set in the database
  #   with a message to console
  # @param [String] object_class The class fr the object to validated
  # @param [Object] object The object to validated, it's a generic object so the
  #   class couldn't be inferred from it
  ###
  def self.already_exists?(object_class, object)
    exists = object_class.exists?(uri: object[:id])
    puts "#{object_class} with uri: '#{object[:id]}' already exists in our records, ignoring" if exists
    exists
  end

  ###
  # @description: Process a given concept shcheme (domain set) to crate it
  #   if necessary
  # @param [Object] domain The concept scheme object to be processed
  ###
  def self.process_domain_set(domains)
    domain_set = domains.select {|d| d["type"] == "skos:ConceptScheme" }.first
    domain_set = domain_set.with_indifferent_access

    already_exists?(DomainSet, domain_set)

    DomainSet.first_or_create!({
                                 uri: domain_set[:id],
                                 title: domain_set[:title]["en-us"],
                                 description: domain_set[:description]["en-us"],
                                 creator: domain_set[:creator]["en-us"]
                               })
  end
end
