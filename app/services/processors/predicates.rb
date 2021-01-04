# frozen_string_literal: true

module Processors
  ###
  # @description: This class will handle the tasks related to predicates,
  #   which identifies the nature / quality of the mapping between the
  #   spine term and mapped term.
  #
  #   E.g. "Identical", "Reworded", "Agreggated", "Dissagreggated", "Intent",
  #   "Concept", "No Match", "Not Applicable", ...
  #
  #   One of the main tasks of this class will be to handle the existence
  #   of the predicates by reading a skos file placed in a fixed directory in
  #   the project. That directory is configured by setting the environment
  #   variable called: "CONCEPTS_DIRECTORY_PATH"
  ###
  class Predicates
    extend Validatable

    ###
    # @description: Process a given file which must contain json data, to
    #   create predicates into the db.
    # @param [File] file The already loaded json file to be processed
    ###
    def self.process_from_file(file)
      file_content = JSON.parse(file)

      # The predicates are listed under the '@graph' object
      predicates = file_content["@graph"]

      predicate_set = process_predicate_set(predicates)

      processed = process_predicates(predicates, predicate_set)

      puts "\n#{ActionController::Base.helpers.pluralize(processed, 'predicate')} processed." +
      (
        processed < 1 ? " Be sure to correctly format the file as an json-ld skos concepts file." : ""
      )
    end

    ###
    # @description: Process a given set of predicates
    # @param [Array] predicates The predicates to be processed. It's an array of
    #   generic Objects
    # @param [DomainSet] The predicate set to be assigned as a parent for each
    #   predicate to be created
    ###
    def self.process_predicates(predicates, predicate_set)
      processed = 0
      predicates.each do |predicate|
        predicate = predicate.with_indifferent_access

        # The concept scheme is processed, let's start with the proper predicates
        next unless valid_predicate(predicate)

        Predicate.create!({
                            definition: Parsers::Specifications.read!(predicate, "definition"),
                            pref_label: Parsers::Specifications.read!(predicate, "prefLabel"),
                            uri: predicate[:id],
                            weight: Parsers::Specifications.read!(predicate, "weight"),
                            predicate_set: predicate_set
                          })

        processed += 1
      end

      processed
    end

    ###
    # @description: Determines if a predicate is valid to incorporate to our records. It should not be of
    #   type: "concept scheme" and it should not be already present.
    # @param [Hash] predicate
    # @return [TrueClass|FalseClass]
    ###
    def self.valid_predicate predicate
      !(
        Array(Parsers::Specifications.read!(predicate, "type")).any? {|type|
          type.downcase.include?("conceptscheme")
        } ||
        already_exists?(Predicate, predicate, print_message: true)
      )
    end

    ###
    # @description: Process a given concept scheme (predicate set) to create it
    #   if necessary
    # @param [Object] nodes the collection of nodes to be processed
    ###
    def self.process_predicate_set(nodes)
      predicate_set = nodes.select {|d| d["type"] == "skos:ConceptScheme" }.first
      predicate_set = predicate_set.with_indifferent_access

      already_exists?(PredicateSet, predicate_set, print_message: true)

      PredicateSet.first_or_create!({
                                      uri: predicate_set[:id],
                                      title: predicate_set[:title]["en-us"],
                                      description: predicate_set[:description]["en-us"],
                                      creator: predicate_set[:creator]["en-us"]
                                    })
    end
  end
end
