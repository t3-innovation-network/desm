# frozen_string_literal: true

module Exporters
  ###
  # @description: Manages to export a mapping export profile in JSON-LD format to let the user download it.
  ###
  class MappingExportProfile
    def initialize(domain)
      @domain = domain
    end

    def export
      raise ArgumentError, "This abstract class does not have a spine" if @domain.spine.nil?

      {
        "@configurationProfile": configuration_profile,
        "@abstractClass": @domain.to_json_ld,
        "@spine": spine
      }
    end

    private

    def configuration_profile
      structure = @domain.configuration_profile.structure
                    .deep_transform_keys { |key| key.to_s.camelcase }
                    .with_indifferent_access

      remove_agents(structure)
    end

    def remove_agents(structure)
      structure["StandardsOrganizations"].each do |dso|
        dso.delete("dsoAgents")
      end
      structure
    end

    def spine
      @domain.spine.to_json_ld.merge({
                                       graph: @domain.spine.terms.map(&:raw)
                                     })
    end
  end
end
