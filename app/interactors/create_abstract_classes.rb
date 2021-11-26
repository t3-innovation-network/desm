# frozen_string_literal: true

class CreateAbstractClasses
  include Interactor
  include SchemeDefinitionFetchable

  before do
    context.fail!(error: "uri must be present") unless context.uri.present?
  end

  def call
    skos_content = fetch_definition(context.uri)
    processor = Processors::Domains.new(skos_content)

    context.domain_set = processor.create
  rescue StandardError => e
    Rails.logger.error(e.inspect)
    context.fail!(error: e.inspect)
  end
end
