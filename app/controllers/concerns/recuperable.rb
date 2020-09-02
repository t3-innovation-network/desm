# frozen_string_literal: true

###
# @description: Error module to Handle errors globally
###
module Recuperable
  ###
  # @description: Prepare for all the possible errors rescuing in a different
  #   way per class of error
  # @param [Class] this_class
  ###
  def self.included(this_class)
    errors_and_messages = define_errors

    this_class.class_eval do
      errors_and_messages.each do |error, config|
        rescue_from error.to_s.constantize do |e|
          error_message =
            if config[:include_original_error_message]
              t(config[:message_key], message: e.message)
            else
              t(config[:message_key])
            end

          handle(error_message, config[:status_code])
        end
      end
    end
  end

  ###
  # @description: Handles the exception with a message and a redirection
  # @param [String] message
  # @param [NamedRoute] path
  ###
  def handle(message, http_code=:internal_server_error)
    render json: {error: message}, status: http_code
  end

  ###
  # @description: Define all the errors that will be handled, with its respective configuration
  #   An error can have a message to return and if it includes or not the original error message.
  #   Remember to include this message also in the corresponding translation file
  #
  #   The message is a key that must exist in the translation files. E.g.
  #   "errors.not_found" will be defined in the file 'config/locales/erros/en.yml'
  #
  #   The status code si an existing status code that con be both a number or a symbol. A list of
  #   the possible symbol names can be found in the link below.
  #
  # @see https://gist.github.com/mlanett/a31c340b132ddefa9cca
  #
  # #return [Hash]
  ###
  def self.define_errors
    {
      "ActiveRecord::RecordNotFound": {
        message_key: "errors.not_found",
        status_code: :not_found,
        include_original_error_message: false
      },
      "ActiveRecord::RecordInvalid": {
        message_key: "errors.record_invalid",
        status_code: :unprocessable_entity,
        include_original_error_message: true
      },
      "ActiveRecord::RecordNotDestroyed": {
        message_key: "errors.record_not_destroyed",
        status_code: :unprocessable_entity,
        include_original_error_message: true
      },
      "InvalidCredentials": {
        message_key: "errors.auth.invalid_credentials",
        status_code: :unprocessable_entity,
        include_original_error_message: true
      },
      "InvalidSpecification": {
        message_key: "errors.specs.invalid_specification",
        status_code: :unprocessable_entity,
        include_original_error_message: false
      }
    }
  end
end
