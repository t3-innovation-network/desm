# frozen_string_literal: true

class CreateDso
  include Interactor

  before do
    context.fail!(error: "configuration profile must be present") unless context.configuration_profile.present?
    context.fail!(error: "email must be present") unless context.email.present?
    context.fail!(error: "name must be present") unless context.name.present?
  end

  def call
    context.dso = Organization.create!(dso_attributes)
  end

  private

  def dso_attributes
    context.to_h.slice(
      :administrator,
      :configuration_profile,
      :description,
      :email,
      :homepage_url,
      :name,
      :standards_page
    )
  end
end
