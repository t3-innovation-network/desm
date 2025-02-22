# frozen_string_literal: true

###
# @description: Place all the actions related to mapping alignments
###
module API
  module V1
    class AlignmentsController < BaseController
      include ConfigurationProfileQueryable
      before_action :authorize_with_policy, except: :index

      ###
      # @description: List of alignments. It can be filtered by passing a list of possible filter
      #   values detailed in filter method
      ###
      def index
        terms = current_configuration_profile.alignments
                  .includes(
                    :predicate,
                    :specification,
                    mapping: %i(organization),
                    mapped_terms: %i(
                      organization property vocabularies
                    )
                  )
                  .mapped_for_spine(params[:spine_id])
                  .where.not(predicate_id: nil)
                  .order(:spine_term_id, :uri)

        # get all specifictation ids for mapped terms ids and group by mapped term id
        mapped_term_ids = terms.flat_map { |t| t.mapped_terms.map(&:id) }
        specification_ids =
          Specification.joins(:terms)
            .select("specifications.id as id, terms.id as term_id")
            .where("terms.id = ANY(ARRAY[?]::int[])", mapped_term_ids)
            .group_by(&:term_id).transform_values { |v| v.map(&:id) }

        render json: terms, with_schema_name: true, specification_ids:
      end

      def create
        alignments_params = params
                              .permit(alignments: [:id, :predicate_id, { mapped_term_ids: [] }])
                              .require(:alignments)

        mapping = policy_scope(Mapping).find_by(id: params.fetch(:mapping_id))
        raise Pundit::NotAuthorizedError, "not allowed to update this mapping" unless mapping.present?

        interactor = SaveAlignments.call(alignments: alignments_params, mapping:)
        if interactor.success?
          adds = ActiveModel::Serializer::CollectionSerializer.new(interactor.adds,
                                                                   each_serializer: AlignmentSerializer)
          render json: { adds: }, status: :created
        else
          render json: { error: interactor.error }, status: :unprocessable_entity
        end
      end

      ###
      # @description: Updates a single mapping term, firstly updating its mapped terms
      ###
      def update
        ActiveRecord::Base.transaction do
          @instance.update_mapped_terms(params[:alignment][:mapped_terms]) unless params[:alignment][:mapped_terms].nil?
          @instance.update!(permitted_params)
        end

        render json: @instance, include: %i(mapped_terms)
      end

      ###
      # @description: Removes an alignment from our records
      ###
      def destroy
        @instance.destroy!

        render json: {
          success: true
        }
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
        params.require(:alignment).permit(:comment, :predicate_id, transformation: {})
      end
    end
  end
end
