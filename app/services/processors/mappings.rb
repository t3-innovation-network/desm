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
      spine = specification.domain.spine

      mapping = Mapping.create!(
        name: name,
        title: name,
        user: user,
        specification: specification,
        spine_id: spine.id
      )

      create_mapping_terms(mapping)

      mapping
    end

    ###
    # @description: Creates the terms for the mapping.
    # @param [Mapping] mapping: The mapping for which the terms are going to be created.
    #
    # @return [Array]
    ###
    def self.create_mapping_terms mapping
      spine = mapping.spine
      spine.terms.each do |term|
        # Do not create this term if there's already one with the same uri
        next if MappingTerm.find_by(uri: term.desm_uri)

        MappingTerm.create!(
          uri: term.desm_uri,
          mapping: mapping,
          spine_term_id: term.id
        )
      end
    end
  end
end
