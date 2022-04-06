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
    MIN_PASSWORD_LENGTH = begin
      Integer(Desm::MIN_PASSWORD_LENGTH)
    rescue StandardError
      8
    end
    PASSWORD_VALIDATION_RULES = {
      # @description: Level of deductibility. 18 is the library's default, known as an acceptable level
      #   of entropy.
      min_entropy: 15,
      min_word_length: MIN_PASSWORD_LENGTH,
      # @description: Use a dictionary to improve the validation of the password.
      use_dictionary: true
    }.freeze
    validates :password, password_strength: PASSWORD_VALIDATION_RULES
  end

  protected

  ###
  # @description: Generates a secure, unique token to be used in the model
  #   that includes this concern.
  # @return [String]
  ###
  def generate_token
    loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      break random_token unless self.class.default_scoped.exists?(token: random_token)
    end
  end
end
