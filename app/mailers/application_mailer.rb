# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: Rails.configuration.action_mailer.default_options[:from]
  layout "mailer"

  ###
  # @description: Initialize the application mailer class. All global variables will
  #   be available for the child classes
  ###
  def initialize
    @config = Rails.configuration.action_mailer.default_options
    super
  end
end
