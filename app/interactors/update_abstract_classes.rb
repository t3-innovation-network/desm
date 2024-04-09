# frozen_string_literal: true

class UpdateAbstractClasses
  include Interactor
  include SchemeDefinitionFetchable

  before do
    context.fail!(error: "json body must be present") unless context.json_body.present?
    context.fail!(error: "domain_set must be present") unless context.domain_set.present?
  end

  def call
    processor = Processors::Domains.new(context.json_body, domain_set: context.domain_set)
    processor.update
  rescue StandardError => e
    Rails.logger.error(e.inspect)
    context.fail!(error: e.message)
  end
end
