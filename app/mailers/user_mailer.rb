# frozen_string_literal: true

class UserMailer < ApplicationMailer
  before_action :set_params

  ###
  # @description: Sends an email to the user with a welcome message
  ###
  def welcome
    @user.generate_password_token!

    @reset_password_url = URI(@config[:host])
    @reset_password_url.path = "/reset-password"
    @reset_password_url.query = { token: @user.reset_password_token }.to_query

    @title = t("mailers.welcome.title")
    mail(to: @user.email, subject: t("mailers.welcome.subject"))
  end

  ###
  # @description: Sends an email to the user with a instructions on how
  #   to reset the password.
  ###
  def forgot_pass
    @title = t("mailers.forgot_pass.title")
    @url = "#{@config[:host]}/reset-password?token=#{@user.reset_password_token || ''}"

    mail(to: @user.email, subject: t("mailers.forgot_pass.subject"))
  end

  private

  ###
  # @description: Instantiate the user from params
  ###
  def set_params
    @user = params[:user]
  end
end
