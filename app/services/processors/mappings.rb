# frozen_string_literal: true

module Processors
  ###
  # @description: This class will handle the tasks related to mappings
  ###
  class Mappings
    ###
    # @description: Create the mapping entry from a specification
    #
    # @param [Specification] specification The specification that this mapping is created from
    ###
    def self.create(specification, user)
      name = "#{user.organization.name} - #{specification.domain.pref_label}"
      @spine = specification.domain.spine

      ActiveRecord::Base.transaction do
        mapping = Mapping.create!(
          name: name,
          title: name,
          user: user,
          specification: specification,
          spine_id: @spine.id
        )

        create_alignments(mapping)

        mapping
      end
    end

    ###
    # @description: Creates the terms for the mapping (alignments).
    # @param [Mapping] mapping: The mapping for which the terms are going to be created.
    #
    # @return [Array]
    ###
    def self.create_alignments mapping
      terms = 0
      mapping.spine.terms.each do |term|
        # Do not create this term if there's already one with the same uri
        # next if Alignment.find_by(uri: term.desm_uri)

        Alignment.create!(
          uri: term.desm_uri(@spine.domain),
          mapping: mapping,
          spine_term_id: term.id
        )

        terms += 1
      end

      # The mapping should have terms assigned
      return if terms.positive?

      throw "Could not create candidate alignments because the terms already "\
        "exists in our records. Please review the previously uploaded specifications "\
        "and mappings"
    end
  end
end
