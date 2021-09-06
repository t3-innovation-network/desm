# frozen_string_literal: true

class CreateConceptScheme
  include Interactor
  include SkosFeedable

  before do
    context.fail!(error: "uri must be present") unless context.uri.present?
    context.fail!(error: "name must be present") unless context.name.present?
    context.fail!(error: "organization must be present") unless context.organization.present?
  end

  def call
    skos_content = fetch_definition(context.uri)
    processor = Processors::Vocabularies.new(skos_content)

    context.vocabulary = processor.create(context.name, context.organization)
  end
end
