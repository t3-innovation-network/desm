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
      # Make the file content available as json
      file_content = JSON.parse(file)

      # The domains are listed under the '@graph' object, because at this
      # stage we are dealing with a json-ld file
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

      domains_in_file
    end
  end
end
