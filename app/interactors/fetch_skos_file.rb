# frozen_string_literal: true

class FetchSkosFile
  include Interactor
  include SchemeDefinitionFetchable

  before do
    context.fail!(error: "uri must be present") unless context.uri.present?
  end

  def call
    skos_content = fetch_definition(context.uri)
    @parser = Parsers::Skos.new(file_content: skos_content)

    context.valid = @parser.valid_skos?
    context.skos_file = skos_content
    context.concept_names = @parser.concept_names
  end
end
