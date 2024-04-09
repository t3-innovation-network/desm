# frozen_string_literal: true

###
# @description: Place all the actions related to audits
###
module API
  module V1
    class AuditsController < BaseController
      before_action :authorize_with_policy
      before_action :validate, only: :index

      ###
      # @description: Lists the audits, being able to filter it.
      ###
      def index
        @audits = filter

        render json: @audits
      end

      private

      ###
      # @description: Validate the presence of a class to get the audits from. Otherwise we might
      #   end up wasting memory in an unnecessary list of audits.
      ###
      def validate
        raise "No class_name provided. We need it in order to return audits." unless params[:class_name].present?
        raise "No instance ids provided" unless params[:instance_ids].present?

        instantiate_params
      end

      ###
      # @description: Instantiate all the necessary variables for filtering after validation and before the
      #   filtering itself.
      ###
      def instantiate_params
        # The ids of the entities to look for changes. We need it to be in an array format
        @ids = params[:instance_ids].split(",")

        # Adding a second after the mapping was marked as "mapped" to exclude operations completed
        # in the same transaction
        @date_from = (Time.parse(params[:date_from]) + 1) if params[:date_from].present?
      end

      ###
      # @description: Filter the list of audits using the provided list of params
      # @return [Activerecord::Relation]
      ###
      def filter
        # Since the list might be a hugh list, we initially filter by class name and ids
        # If the consumer needs more than one class, it can make separate requests
        audits = Audited::Audit.where(auditable_type: params[:class_name], auditable_id: @ids)

        # It might be the case when the consumer only needs "update" or "create" audits
        audits = audits.where(action: params[:audit_action]) if params[:audit_action].present?

        # The consumer can specify "date_from" param to only retrieve audits from that date on
        audits = audits.where(created_at: @date_from..Time.now) if @date_from.present?

        # The order of the audits will be in ascendent way, meaning the newest first
        audits.order(created_at: :desc)
      end

      ###
      # @description: Execute the authorization policy
      ###
      def authorize_with_policy
        authorize(with_instance(Audited::Audit))
      end
    end
  end
end
