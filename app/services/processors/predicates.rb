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

      processed = process_predicates(predicates)

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
    def self.process_predicates(predicates)
      processed = 0
      predicates.each do |predicate|
        predicate = predicate.with_indifferent_access

        # The concept scheme is processed, let's start with the proper predicates
        next if predicate[:type] == "skos:ConceptScheme"

        next if already_exists?(Predicate, predicate, print_message: true)

        Predicate.create!({
                            uri: predicate[:id],
                            pref_label: predicate[:prefLabel]["en-us"],
                            definition: predicate[:definition]["en-us"]
                          })

        processed += 1
      end

      processed
    end
  end
end
