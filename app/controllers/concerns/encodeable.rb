# frozen_string_literal: true

###
# @description: Gives the ability to get the current user data if there's any
###
module Encodeable
  extend ActiveSupport::Concern

  included do
    JWT_SECRET = ENV["JWT_SECRET"]
    JWT_ALGORITHM = ENV["JWT_ALGORITHM"]
  end

  ###
  # @description: Decodes sensitive information provided as an token, using
  #   JSON web token approach.
  ###
  def decode token
    JWT.decode(
      token,
      JWT_SECRET,
      true,
      {
        algorithm: JWT_ALGORITHM
      }
    ).first.with_indifferent_access
  end
end
