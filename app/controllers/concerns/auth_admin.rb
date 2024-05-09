# frozen_string_literal: true

module AuthAdmin
  extend ActiveSupport::Concern

  included do
    before_action :authorize!
  end

  private

  def authorize!
    raise Pundit::NotAuthorizedError unless current_user&.super_admin?
  end
end
