# frozen_string_literal: true

class CreateMappingPredicates
  include Interactor
  include SkosFeedable

  before do
    context.fail!(error: "uri must be present") unless context.uri.present?
  end

  def call
    skos_content = fetch_definition(context.uri)
    processor = Processors::Predicates.new(skos_content)

    context.predicate_set = processor.create
  rescue StandardError => e
    Rails.logger.error(e.inspect)
    context.fail!(error => e.inspect)
  end
end
