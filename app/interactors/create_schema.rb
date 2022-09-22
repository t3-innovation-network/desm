# frozen_string_literal: true

class CreateSchema
  include Interactor
  include SchemeDefinitionFetchable

  before do
    context.fail!(error: "domain_id must be present") unless context.domain_id.present?
    context.fail!(error: "name must be present") unless context.name.present?
    unless context.configuration_profile_user.present?
      context.fail!(error: "configuration profile user must be present")
    end
    context.fail!(error: "uri must be present") unless context.uri.present?
  end

  def call
    file_content = fetch_definition(context.uri)

    context.specification = Processors::Specifications.create(
      spec: file_content,
      configuration_profile_user: context.configuration_profile_user,
      name: context.name,
      domain_id: context.domain_id
    )
  end
end
