# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # Authorization handling
  include Pundit::Authorization

  # Handle errors with a concern
  include Recoverable

  helper_method :current_configuration_profile
  helper_method :current_configuration_profile_user
  helper_method :current_organization
  helper_method :current_user
  helper_method :impersonation_mode?

  # We manage our own security for sessions
  skip_before_action :verify_authenticity_token

  # Handle unauthorized accesses with a json error message
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  ###
  # @description: Create a class instance of the model being represented
  # @return [Object] an instance of the class being represented
  ###
  def with_instance(model_name = nil)
    model_name = controller_name.classify.constantize unless model_name.present?
    @instance = params[:id].present? ? model_name.find(params[:id]) : model_name.new
  end

  ###
  # @description: Returns a 404 json response
  ###
  def not_found
    render json: { error: t("errors.not_found") }, status: :not_found
  end

  private

  ###
  # @description: Returns the current configuration profile
  ###
  def current_configuration_profile
    @current_configuration_profile ||= begin
      id = session[:current_configuration_profile_id]
      configuration_profile = ConfigurationProfile.find_by(id:) if id
      configuration_profile || current_user&.configuration_profiles&.first
    end
  end

  ###
  # @description: Returns the current configuration profile/user connection
  ###
  def current_configuration_profile_user
    @current_configuration_profile_user ||=
      current_configuration_profile&.configuration_profile_users&.find_by(user: current_user)
  end

  ###
  # @description: Returns the current organization
  ###
  def current_organization
    @current_organization ||= current_configuration_profile_user&.organization
  end

  ###
  # @description: Returns the current user from the session
  ###
  def current_user
    return unless session[:user_id]

    @current_user ||= User.find(session[:user_id])
  end

  ###
  # @description: Returns a pundit user object
  ###
  def pundit_user
    UserContext.new(current_user, configuration_profile: current_configuration_profile,
                                  configuration_profile_user: current_configuration_profile_user)
  end

  ###
  # @description: Returns a json message when an error happens due to an unpermittted
  #   access to an action
  # @param [Exception] err The exception that was raised
  ###
  def user_not_authorized(err)
    policy_name = err.policy.class.to_s.underscore
    message = I18n.t("#{policy_name}.#{err.query}", scope: "pundit", default: :default)

    respond_to do |format|
      format.html do
        flash[:alert] = message
        redirect_back(fallback_location: root_path)
      end
      format.json do
        render json: { error: message }, status: :unauthorized
      end
    end
  end

  ###
  # @description: Returns `true` if an admin is impersonating an agent
  ###
  def impersonation_mode?
    session[:impostor_id].present?
  end
end
