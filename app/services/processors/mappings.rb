# frozen_string_literal: true

module Processors
  ###
  # @description: This class will handle the tasks related to mappings
  ###
  class Mappings
    ###
    # @description: Initializes the mapping processor with a specification and a user
    # @param specification [Specification] The specification that this mapping is created from
    # @param user [User]
    ###
    def initialize specification, user
      @specification = specification
      @user = user
    end

    ###
    # @description: Create the mapping instance from a specification
    ###
    def create
      name = "#{@user.organization&.name || 'Default'} - #{@specification.domain.pref_label}"
      Mapping.create!(
        name: name,
        title: name,
        user: @user,
        specification: @specification,
        spine: @specification.domain.spine
      )
    end
  end
end
