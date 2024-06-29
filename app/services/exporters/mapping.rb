# frozen_string_literal: true

module Exporters
  ###
  # @description: Exports a mapping in one of supported formats.
  ###
  class Mapping
    attr_reader :mapping

    def initialize(mapping)
      @mapping = mapping
    end

    # rubocop:disable Naming/MemoizedInstanceVariableName
    def to_csv
      @csv ||= CSV.new(mapping).export
    end

    def to_jsonld
      @jsonld ||= JSONLD.new(mapping).export
    end
    # rubocop:enable Naming/MemoizedInstanceVariableName
  end
end
