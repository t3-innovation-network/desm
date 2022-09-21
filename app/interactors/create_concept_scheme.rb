# frozen_string_literal: true

class CreateConceptScheme
  include Interactor
  include SchemeDefinitionFetchable

  before do
    context.fail!(error: "uri must be present") unless context.uri.present?
    context.fail!(error: "name must be present") unless context.name.present?
    context.fail!(error: "configuration profile must be present") unless context.configuration_profile.present?
  end

  def call
    skos_content = fetch_definition(context.uri)
    processor = Processors::Vocabularies.new(skos_content)

    context.vocabulary = processor.create(context.name, context.configuration_profile)
  end
end
