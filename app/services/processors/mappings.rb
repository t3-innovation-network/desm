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
  end
end
