# frozen_string_literal: true

module API
  module V1
    class ConfigurationProfilesAbstractController < BaseController
      DEFAULT_CP_NAME = "DESM CP - #{DateTime.now.rfc3339}".freeze
      VALID_PARAMS_LIST = [
        :created_at,
        :description,
        :name,
        :updated_at,
        :predicate_strongest_match,
        { json_mapping_predicates: {},
          json_abstract_classes: {},
          structure: [
            :created_at,
            :description,
            :name,
            :updated_at,
            { mapping_predicates: %i(name version description origin),
              abstract_classes: %i(name version description origin),
              standards_organizations: [
                :email,
                :name,
                :description,
                :homepage_url,
                :standards_page,
                { dso_administrator: %i(fullname email phone github_handle),
                  dso_agents: [%i(fullname email phone github_handle lead_mapper)],
                  associated_schemas: [
                    [
                      :associated_abstract_class,
                      :description,
                      :encoding_schema,
                      :name,
                      :origin,
                      :version,
                      { associated_concept_schemes: [%i(name version description origin)] }
                    ]
                  ] }
              ] }
          ] }
      ].freeze
    end
  end
end
