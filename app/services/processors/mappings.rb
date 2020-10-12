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

    ###
    # @description: Creates the terms for the mapping.
    # @param [Mapping] mapping: The mapping for which the terms are going to be created.
    # @params [Array] terms: The list of terms as an array of objects. These are the
    #   specification terms, selected to be mapped against the spine.
    #
    # @return [Array]
    ###
    def self.create_selected_terms(mapping, terms)
      ActiveRecord::Base.transaction do
        terms.each do |term|
          term = Term.find(term[:id])
          # Do not add this term as selected for this mapping if there's already one
          # with the same uri
          next if mapping.selected_terms.include?(term)

          mapping.selected_terms << term
        end
        mapping.save!
      end
    end
  end
end
