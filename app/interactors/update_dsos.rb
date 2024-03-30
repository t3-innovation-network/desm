# frozen_string_literal: true

class UpdateDsos
  include Interactor
  include UniquenessValidatable

  delegate :configuration_profile, :dsos, to: :context
  delegate :structure, to: :configuration_profile

  before do
    context.fail!(error: "configuration profile must be present") unless configuration_profile.present?
    repeated_dsos = check_uniqueness_for(structure.fetch("standards_organizations", []).map { |dso| dso["name"] })
    if repeated_dsos.any?
      error = I18n.t("errors.config.organization.update", count: repeated_dsos.size,
                                                          message: repeated_dsos.join(", "))
      context.fail!(error:)
    end

    context.dsos = []
  end

  def call
    ActiveRecord::Base.transaction do
      context.dsos = structure.fetch("standards_organizations", []).map do |dso_data|
        create_or_update_dso(dso_data.merge(configuration_profile:))
      end
      clean_not_existing_dsos
    end
  rescue StandardError => e
    Rails.logger.error(e.inspect)
    context.fail!(error: e.message)
  end

  private

  def clean_not_existing_dsos
    dsos_ids = dsos.map(&:id)
    configuration_profile.standards_organizations.each do |dso|
      next if dsos_ids.include?(dso.id)

      # raise error if organization has configuration profile users
      raise ArgumentError, I18n.t("errors.config.organization.destroy", count: 1, message: dso.name) \
        if dso.configuration_profile_users.for_configuration_profile(configuration_profile).exists?

      # delete organization <-> configuration profile association
      configuration_profile.standards_organizations.delete(dso)
    end
  end

  def create_or_update_dso(dso_data)
    interactor = CreateOrUpdateDso.call(dso_data)
    raise ArgumentError, interactor.error unless interactor.success?

    interactor.dso
  end
end
