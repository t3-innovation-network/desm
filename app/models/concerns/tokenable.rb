# frozen_string_literal: true

###
# @description: Attaches a method called +generate_token+ to the class where its included.
#   This token is garateed to be safe and unique in the model scope.
#
#    IMPORTANT: This method relies on an attribute with the name of: "token". So if the
#    model does not have one, it will not work. You can either add the attribute with a
#    migration or create an alias if the attribute is called by another name, like this:
#    alias_attribute :token, :reset_password_token
###
module Tokenable
  extend ActiveSupport::Concern

  included do
    MIN_PASSWORD_LENGTH = begin # rubocop:disable Lint/ConstantDefinitionInBlock
      Integer(Desm::MIN_PASSWORD_LENGTH)
    rescue StandardError
      8
    end

    validates :password, length: { minimum: MIN_PASSWORD_LENGTH }, unless: -> { password.nil? }
  end

  protected

  ###
  # @description: Generates a secure, unique token to be used in the model
  #   that includes this concern.
  # @return [String]
  ###
  def generate_token(token_column = nil)
    token_column ||= :token

    loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      next if self.class.default_scoped.exists?(token_column => random_token)

      return random_token
    end
  end
end
