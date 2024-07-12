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

    def csv
      @csv ||= CSV.new(mapping).export
    end

    def jsonld
      @jsonld ||= JSONLD.new(mapping).export
    end
  end
end
