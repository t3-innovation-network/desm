# frozen_string_literal: true

class ValidateCpStructure
  include Interactor
  delegate :configuration_profile, :grouped_messages, :messages, to: :context

  before do
    context.fail!(error: "configuration profile must be present") unless context.configuration_profile.present?
    context.messages = []
    context.grouped_messages = {}
  end

  def call
    return unless configuration_profile.incomplete?

    collect_vallidation_errors
    generate_grouped_scope
  end

  private

  GENERAL_PROPERTIES = %w(name description).freeze
  private_constant :GENERAL_PROPERTIES

  def collect_vallidation_errors
    configuration_profile.complete_structure_validation_errors.map do |error|
      path = error[:fragment].split("/")[1..].map { |k| k =~ /^\d+$/ ? k.to_i : k.to_s.underscore }
      context.messages << {
        path:,
        sections: collect_breacrumb_for(path),
        message: enhanced_message_for(error, path)
      }
    end
  end

  def collect_breacrumb_for(path) # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    path.map.with_index do |p, idx|
      next unless p.is_a?(String)
      next if idx.nonzero? && idx == path.size - 1

      key = if idx.zero? && GENERAL_PROPERTIES.include?(p)
              "path"
            else
              "#{path[0..idx].grep(String).join('.')}.path"
            end
      data = I18n.t("ui.dashboard.configuration_profiles.structure.#{key}", default: p.to_s.humanize)
      next data unless (array_idx = path[idx + 1]).is_a?(Integer)

      base_data = configuration_profile.structure.dig(*path[0..idx + 1])
      value = base_data&.dig("name") || base_data&.dig("origin") || base_data&.dig("fullname")
      data + " (#{value.present? ? "#{value}, " : ''}#{(array_idx + 1).ordinalize})"
    end.compact
  end

  def enhanced_message_for(error, path)
    message = error[:message].sub(/.*#{error[:fragment]}'\s+/, "").sub(/\s+in schema.*/, "")
    return message if path.size == 1 && GENERAL_PROPERTIES.exclude?(path[0])

    path[-1].is_a?(String) && message.exclude?("'#{path[-1]}") ? "#{path[-1]} #{message}" : message
  end

  def generate_grouped_scope
    context.grouped_messages = messages.group_by do |m|
      GENERAL_PROPERTIES.include?(m[:path][0]) ? "general" : m[:path][0]
    end
    context.grouped_messages.transform_values! do |v|
      v.group_by { |m| m[:sections].join(" > ") }
    end
  end
end
