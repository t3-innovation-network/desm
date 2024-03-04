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

    def initialize(file, strongest_match: nil, predicate_set: nil)
      @predicate_set = predicate_set
      @predicates_ids = []
      @strongest_match = strongest_match
      super(file)
    end

    ###
    # @description: Process a given file which must contain json data, to
    #   create predicates into the db.
    # @return [PredicateSet]
    ###
    def create
      @predicate_set = create_or_update_predicate_set
      create_or_update_predicates
      assign_strongest_match

      @predicate_set
    end

    ###
    # @description: Process a given file which must contain json data, to
    #   merge/update with existing predicates at the db.
    # @return [PredicateSet]
    ###
    def update
      create_or_update_predicate_set
      create_or_update_predicates
      clear_unused_predicates

      @predicate_set
    end

    private

    def clear_unused_predicates
      @predicates_ids << @predicate_set.strongest_match_id if @predicate_set.strongest_match_id.present?
      unused_predicates_ids = @predicate_set.predicates.ids - @predicates_ids
      with_mappings = Alignment.where(predicate_id: unused_predicates_ids).pluck(:predicate_id)
      @predicate_set.predicates.where(id: unused_predicates_ids - with_mappings).destroy_all
    end

    ###
    # @description: Process a given concept scheme (predicate set) to create or update it
    #   if necessary
    # @param [Object] nodes the collection of nodes to be processed
    ###
    def create_or_update_predicate_set
      ps = first_concept_scheme_node
      parser = Parsers::JsonLd::Node.new(ps)
      arttributes = {
        creator: parser.read!("creator"),
        description: parser.read!("description"),
        source_uri: parser.read!("id"),
        title: parser.read!("title") || parser.read!("label")
      }
      @predicate_set.present? ? @predicate_set.update!(arttributes) : PredicateSet.create!(arttributes)
    end

    ###
    # @description: Process a given set of predicates
    ###
    def create_or_update_predicates
      @concept_nodes.each do |predicate|
        parser = Parsers::JsonLd::Node.new(predicate)

        # The concept scheme is processed, let's start with the proper predicates
        next unless valid_predicate(parser)

        predicate = @predicate_set.predicates.find_or_initialize_by(source_uri: parser.read!("id"))
        predicate.definition = parser.read!("definition")
        predicate.pref_label = parser.read!("prefLabel")
        predicate.weight = parser.read!("weight")
        predicate.save!
        @predicates_ids << predicate.id
      end
    end

    ###
    # @description: Determines if a predicate is valid to incorporate to our records. It should not be of
    #   type: "concept scheme"
    # @return [TrueClass|FalseClass]
    ###
    def valid_predicate(predicate_parser)
      Array.wrap(predicate_parser.read!("type")).none? do |type|
        type.downcase.include?("conceptscheme")
      end
    end

    def assign_strongest_match
      predicate = @predicate_set.predicates.find_by(source_uri: @strongest_match)
      predicate ||= @predicate_set.predicates.first
      @predicate_set.update!(strongest_match: predicate)
    end
  end
end
