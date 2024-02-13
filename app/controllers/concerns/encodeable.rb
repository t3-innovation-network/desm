# frozen_string_literal: true

###
# @description: Gives the ability to get the current user data if there's any
###
module Encodeable
  extend ActiveSupport::Concern

  def decode(token)
    decoded = JWT.decode(
      token,
      Desm::PRIVATE_KEY,
      true,
      {
        algorithm: "HS256"
      }
    )

    decoded.first.with_indifferent_access
  end
end
