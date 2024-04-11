# frozen_string_literal: true

module API
  module V1
    class AdminsController < BaseController
      include AuthAdmin
      before_action :load_admin, only: %i(update destroy)

      def index
        render json: admin_role.users.order(id: :desc)
      end

      def create
        admin = User.create!(admin_params)
        admin.roles << admin_role
        render json: admin
      end

      def update
        @admin.update!(admin_params)
        render json: @admin
      end

      def destroy
        @admin.destroy
        head :ok
      end

      private

      def admin_params
        params
          .require(:admin)
          .permit(:email, :fullname, :password, :password_confirmation)
      end

      def admin_role
        Role.find_by!(name: Desm::ADMIN_ROLE_NAME.downcase)
      end

      def load_admin
        @admin = User.find(params[:id])
        raise ActiveRecord::RecordNotFound unless @admin.super_admin?
      end
    end
  end
end
