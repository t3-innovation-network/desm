# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: Rails.configuration.action_mailer.default_options[:from]
  layout "mailer"
end
