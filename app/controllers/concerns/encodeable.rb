# frozen_string_literal: true

###
# @description: Gives the ability to get the current user data if there's any
###
module Encodeable
  extend ActiveSupport::Concern

  def decode token
    JWT.decode(
      token,
      Desm::JWT_SECRET,
      true,
      {
        algorithm: Desm::JWT_ALGORITHM
      }
    ).first.with_indifferent_access
  end
end
