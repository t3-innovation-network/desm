# frozen_string_literal: true

###
# @description: Manage the password reset logic
###
class PasswordsController < ApplicationController
  include CurrentUserConcern
  include Encodeable

  before_action :validate_email, only: :forgot
  before_action :validate_token, only: :reset
  before_action :validate_password, only: %i(strength reset)

  ###
  # @description: Manages to generate a token and send it to the user via email with
  #   a link to reset the password
  ###
  def forgot
    @user.send_reset_password_instructions if @user.generate_password_token!

    render json: {
      success: true,
      message: "Email sent to the user to reset the password"
    }
  end

  ###
  # @description: Resets the user's password
  ###
  def reset
    @user.reset_password!(@password)

    render json: {
      success: true
    }
  end

  private

  ###
  # @description: Validates the presence of the email bofore generating the token
  #   to reset the password.
  ###
  def validate_email
    raise ArgumentError, "Email not present" unless permitted_params[:email].present?

    @user = User.find_by_email!(permitted_params[:email])
  end

  ###
  # @description: Validates the presence of the passowrd bofore calculating its strength
  ###
  def validate_password
    raise ArgumentError, "Password not provided" unless permitted_params[:password].present?

    @password = permitted_params[:password]
  end

  ###
  # @description: Validates the presence of the token to reset the password, and
  #  its validity.
  ###
  def validate_token
    raise ArgumentError, "Token not present" unless permitted_params[:token].present?

    @user = User.find_by!(reset_password_token: permitted_params[:token])

    raise ArgumentError, "Link not valid or expired. Try generating a new link." unless @user.password_token_valid?
  end

  ###
  # @description: Clean params
  # @return [ActionController::Parameters]
  ###
  def permitted_params
    params.require(:user).permit(:email, :token, :password)
  end
end
