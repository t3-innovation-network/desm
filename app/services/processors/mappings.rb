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

      m = Mapping.create!(
        name: name,
        title: name,
        user: user,
        specification: specification,
        spine_id: spine.id
      )
      m
    end

    ###
    # @description: Creates the terms for the mapping.
    # @param [Mapping] mapping: The mapping for which the terms are going to be created.
    # @params [Array] terms: The list of terms as an array of objects. These are the
    #   specification terms, selected to be mapped against the spine.
    #
    # @return [Array]
    ###
    def self.create_terms(mapping, terms)
      ActiveRecord::Base.transaction do
        terms.each do |term|
          term = Term.find(term[:id])

          # Do not create this term if there's already one with the same uri
          next if MappingTerm.find_by(uri: term.desm_uri)

          MappingTerm.create!(
            uri: term.desm_uri,
            mapping: mapping,
            mapped_term_id: term.id
          )
        end
      end
    end
  end
end
