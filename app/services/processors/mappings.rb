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
    def initialize(specification, configuration_profile_user)
      @specification = specification
      @configuration_profile_user = configuration_profile_user
      @organization = configuration_profile_user.organization
      @user = configuration_profile_user.user
    end

    ###
    # @description: Create the mapping instance from a specification
    ###
    def create
      Mapping.create!(
        configuration_profile_user: @configuration_profile_user,
        specification: @specification,
        spine: @specification.domain.spine
      )
    end
  end
end
