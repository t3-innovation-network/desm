# frozen_string_literal: true

class Api::V1::ConfigurationProfilesAbstractController < ApplicationController
  DEFAULT_CP_NAME = "Desm CP - #{DateTime.now.rfc3339}"
  VALID_PARAMS_LIST = [
    :created_at,
    :description,
    :name,
    :updated_at,
    :predicate_strongest_match,
    json_mapping_predicates: {},
    json_abstract_classes: {},
    structure: [
      :created_at,
      :description,
      :name,
      :updated_at,
      mapping_predicates: %i[name version description origin],
      abstract_classes: %i[name version description origin],
      standards_organizations: [
        :email,
        :name,
        :description,
        :homepage_url,
        :standards_page,
        dso_administrator: %i[fullname email phone github_handle],
        dso_agents: [%i[fullname email phone github_handle]],
        associated_schemas: [
          [
            :associated_abstract_class,
            :description,
            :encoding_schema,
            :name,
            :origin,
            :version,
            associated_concept_schemes: [%i[name version description origin]]
          ]
        ]
      ]
    ]
  ].freeze
end
