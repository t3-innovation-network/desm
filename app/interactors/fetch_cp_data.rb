# frozen_string_literal: true

class FetchCpData
  include Interactor
  delegate :configuration_profile, :skos_method, to: :context

  before do
    context.fail!(error: "configuration_profile must be present") unless configuration_profile.present?
    context.fail!(error: "skos_method must be present") unless skos_method.present?
    if ALLOWED_SKOS_METHODS.exclude?(skos_method.to_s)
      context.fail!(error: "skos method should be one of: #{ALLOWED_SKOS_METHODS.join(', ')}")
    end
  end

  def call
    context.concept_names = data_persisted? ? fetch_from_data : fetch_from_file
  end

  private

  ALLOWED_SKOS_METHODS = %w(json_mapping_predicates json_abstract_classes).freeze
  private_constant :ALLOWED_SKOS_METHODS

  ALLOWED_SKOS_METHODS.each do |skos_value|
    define_method(:"#{skos_value}?") { skos_method.to_s.eql?(skos_value) }
  end

  def data_persisted?
    return configuration_profile.predicate_set_id.present? if json_mapping_predicates?

    configuration_profile.domain_set_id.present?
  end

  def fetch_from_file
    parser = Parsers::Skos.new(file_content: configuration_profile.send(skos_method.to_sym))
    parser.concept_names
  end

  def fetch_from_data
    data = if json_mapping_predicates?
             configuration_profile.mapping_predicates.predicates
           else
             configuration_profile.abstract_classes.domains
           end
    ActiveModelSerializers::SerializableResource.new(data, each_serializer: ConceptNamesSerializer).as_json
  end
end
