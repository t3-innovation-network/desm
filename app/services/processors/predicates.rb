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
  class Predicates < Skos
    include Validatable

    ###
    # @description: Process a given file which must contain json data, to
    #   create predicates into the db.
    # @return [PredicateSet]
    ###
    def create
      @predicate_set = create_predicate_set
      create_predicates

      @predicate_set
    end

    ###
    # @description: Process a given concept scheme (predicate set) to create it
    #   if necessary
    # @param [Object] nodes the collection of nodes to be processed
    ###
    def create_predicate_set
      predicate_set = first_concept_scheme_node

      already_exists?(PredicateSet, predicate_set, print_message: true)

      PredicateSet.first_or_create!({
                                      uri: predicate_set[:id],
                                      title: predicate_set[:title]["en-us"],
                                      description: predicate_set[:description]["en-us"],
                                      creator: predicate_set[:creator]["en-us"]
                                    })
    end

    ###
    # @description: Process a given set of predicates
    ###
    def create_predicates
      @concept_nodes.each do |predicate|
        predicate = predicate.with_indifferent_access

        # The concept scheme is processed, let's start with the proper predicates
        next unless valid_predicate(predicate)

        parser = Parsers::JsonLd::Node.new(predicate)

        Predicate.create!({
                            definition: parser.read!("definition"),
                            pref_label: parser.read!("prefLabel"),
                            uri: predicate[:id],
                            weight: Parsers::Specifications.read!(predicate, "weight"),
                            predicate_set: @predicate_set
                          })
      end
    end

    private

    ###
    # @description: Determines if a predicate is valid to incorporate to our records. It should not be of
    #   type: "concept scheme" and it should not be already present.
    # @param [Hash] predicate
    # @return [TrueClass|FalseClass]
    ###
    def valid_predicate predicate
      !(
        Array(parser.read!("type")).any? {|type|
          type.downcase.include?("conceptscheme")
        } ||
        already_exists?(Predicate, predicate, print_message: true)
      )
    end
  end
end
