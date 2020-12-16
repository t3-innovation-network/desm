# frozen_string_literal: true

class UserMailer < ApplicationMailer
  before_action :set_params

  ###
  # @description: Sends an email to the user with a welcome message
  ###
  def welcome
    @url = "#{@config[:host]}/sign-in"

    mail(to: @user.email, subject: "T3 Desm - Welcome to desmsolutions.org!")
  end

  ###
  # @description: Sends an email to the user with a instructions on how
  #   to reset the password.
  ###
  def forgot_pass
    @url = "#{@config[:host]}/reset-password?token=#{(@user.reset_password_token || '')}"

    mail(to: @user.email, subject: "T3 Desm - Instructions to reset your password")
  end

  private

  ###
  # @description: Instantiate the user from params
  ###
  def set_params
    @user = params[:user]
    @config = Rails.configuration.action_mailer.default_options
  end
end
