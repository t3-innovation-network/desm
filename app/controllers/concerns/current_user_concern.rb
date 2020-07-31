# frozen_string_literal: true

###
# @description: Gives the ability to get the current user data if there's any
###
module CurrentUserConcern
  extend ActiveSupport::Concern

  included do
    before_action :set_current_user
  end

  ###
  # @description: Sets the current user class variable if there's a session
  ###
  def set_current_user
    @current_user = User.find(session[:user_id]) if session[:user_id]
  rescue ActiveRecord::RecordNotFound
    # Blank the session if the user was removed
    session[:user_id] = nil
  end
end
