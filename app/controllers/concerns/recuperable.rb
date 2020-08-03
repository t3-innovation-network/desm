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
    this_class.class_eval do
      rescue_from ActiveRecord::RecordNotFound do
        handle(t("errors.not_found"))
      end

      rescue_from ActiveRecord::RecordInvalid do |e|
        handle(t("errors.record_invalid", message: e.message))
      end

      rescue_from ActiveRecord::RecordNotDestroyed do |e|
        handle(t("errors.record_not_destroyed", message: e.message))
      end
    end
  end

  private

  ###
  # @description: Handles the exception with a message and a redirection
  # @param [String] message
  # @param [NamedRoute] path
  ###
  def handle(message)
    render json: {error: message}
  end
end
