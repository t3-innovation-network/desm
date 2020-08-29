# frozen_string_literal: true

###
# @description: This module will handle the tasks related to predicates,
#   which identifies the nature / quality of the mapping between the
#   spine term and mapped term.
#
#   E.g. "Identical", "Reworded", "Agreggated", "Dissagreggated", "Intent",
#   "Concept", "No Match", "Not Applicable", ...
#
#   One of the main tasks of this module will be to handle the existence
#   of the predicates by reading a skos file placed in a fixed directory in
#   the project. That directory is configured by setting the environment
#   variable called: "CONCEPTS_DIRECTORY_PATH"
###
module PredicatesHelper
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

    p "#{ActionController::Base.helpers.pluralize(processed, 'predicate')} processed." +
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

      next if already_exists("Predicate", predicate)

      Predicate.create!({
                          uri: predicate[:id],
                          pref_label: predicate[:prefLabel]["en-us"],
                          definition: predicate[:definition]["en-us"]
                        })

      processed += 1
    end

    processed
  end

  ###
  # @description: Validate the existence of a predicate in the database
  #   with a message to console
  # @param [String] object_class The class fr the object to validated
  # @param [Object] object The object to validated, it's a generic object so the
  #   class couldn't be inferred from it
  ###
  def self.already_exists(object_class, object)
    exists = object_class.constantize.where(uri: object[:id]).count.positive?
    p "#{object_class} with uri: '#{object[:id]}' already exists in our records, ignoring" if exists
    exists
  end
end
