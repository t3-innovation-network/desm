# frozen_string_literal: true

class Api::V1::AdminsController < ApplicationController
  before_action :authorize!

  def index
    render json: admin_role.users.order(id: :desc)
  end

  def create
    admin_params = params
                   .require(:admin)
                   .permit(:email, :fullname, :password, :password_confirmation)

    admin = User.create!(admin_params)
    admin.roles << admin_role
    render json: admin
  end

  private

  def admin_role
    Role.find_by!(name: "super admin")
  end

  def authorize!
    raise Pundit::NotAuthorizedError unless current_user&.super_admin?
  end
end
