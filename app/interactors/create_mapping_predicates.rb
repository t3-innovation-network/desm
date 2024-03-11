# frozen_string_literal: true

class CreateMappingPredicates
  include Interactor
  include SchemeDefinitionFetchable

  before do
    context.fail!(error: "json body must be present") unless context.json_body.present?
  end

  def call
    processor = Processors::Predicates.new(context.json_body, strongest_match: context.strongest_match)
    context.predicate_set = processor.create
  rescue StandardError => e
    Rails.logger.error(e.inspect)
    context.fail!(error: e.message)
  end
end
