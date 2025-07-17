# frozen_string_literal: true

###
# @description: Place all the actions related to terms
###
module API
  module V1
    class TermsController < BaseController
      before_action :authorize_with_policy, except: :index

      ###
      # @description: All the terms from a specification
      ###
      def index
        terms = Specification.find(params[:id]).terms.includes(:property, :vocabularies)

        render json: terms
      end

      ###
      # @description: Returns the term with id equal to the one passed in params
      ###
      def show
        render json: TermSerializer.new(@instance, vocabulary_concepts: params[:vocabulary_concepts]).as_json
      end

      ###
      # @description: Updates a term in conjuntion with its property
      ###
      def update
        @instance.update(permitted_params)

        render json: @instance
      end

      ###
      # @description: Removes a term from the database
      ###
      def destroy
        @instance.destroy!

        render json: { status: :removed }
      end

      private

      ###
      # @description: Execute the authorization policy
      ###
      def authorize_with_policy
        authorize(with_instance)
      end

      ###
      # @description: Clean params
      # @return [ActionController::Parameters]
      ###
      def permitted_params
        params.require(:term).permit(
          :name, :uri, :specification_id, { vocabulary_ids: [] },
          property_attributes: [
            :comment, :id, :label, :uri, :scheme, :source_uri, :subproperty_of, :value_space,
            { range: [] }, :path, { domain: [] }, :selected_domain, :selected_range
          ]
        )
      end
    end
  end
end
