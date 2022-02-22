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
  #   the project, called 'concepts'.
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
      parser = Parsers::JsonLd::Node.new(predicate_set)
      already_exists?(PredicateSet, parser.read!("id"), print_message: true)

      PredicateSet.first_or_create!({
                                      source_uri: parser.read!("id"),
                                      title: parser.read!("title") || parser.read!("label"),
                                      description: parser.read!("description"),
                                      creator: parser.read!("creator")
                                    })
    end

    ###
    # @description: Process a given set of predicates
    ###
    def create_predicates
      @concept_nodes.each do |predicate|
        parser = Parsers::JsonLd::Node.new(predicate)

        # The concept scheme is processed, let's start with the proper predicates
        next unless valid_predicate(parser)

        Predicate.find_or_initialize_by(source_uri: parser.read!("id")) do |p|
          p.update!({
                      definition: parser.read!("definition"),
                      pref_label: parser.read!("prefLabel"),
                      weight: parser.read!("weight"),
                      predicate_set: @predicate_set
                    })
        end
      end
    end

    private

    ###
    # @description: Determines if a predicate is valid to incorporate to our records. It should not be of
    #   type: "concept scheme" and it should not be already present.
    # @return [TrueClass|FalseClass]
    ###
    def valid_predicate predicate_parser
      !(
        Array(predicate_parser.read!("type")).any? {|type|
          type.downcase.include?("conceptscheme")
        } ||
        already_exists?(Predicate, predicate_parser.read!("id"), print_message: true)
      )
    end
  end
end
