# frozen_string_literal: true

class UpdateMappingPredicates
  include Interactor
  include SchemeDefinitionFetchable

  before do
    context.fail!(error: "json body must be present") unless context.json_body.present?
    context.fail!(error: "predicate_set must be present") unless context.predicate_set.present?
  end

  def call
    processor = Processors::Predicates.new(context.json_body, predicate_set: context.predicate_set)
    processor.update
  rescue StandardError => e
    Rails.logger.error(e.inspect)
    context.fail!(error: e.message)
  end
end
