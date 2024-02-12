# frozen_string_literal: true

module Parsers
  ###
  # @description: This class contains all the operations related to parse a specification
  #   Particularly, at this stage we deal with Ruby objects. It might be simple or relatively
  #   complex objects, hence the operations needed to process it.
  ###
  class Specification
    include Connectable
    include SchemeDefinitionFetchable

    attr_accessor :graph, :context

    def initialize(file_content: {})
      validate_spec_format(file_content)

      # Ensure we're dealing with a hash, otherwise the "merge!" method below will not work
      @context = resolve_context if @context.is_a?(String) && uri?(@context)
    end

    ###
    # @description: Initialize the specifications parser
    # @param [Hash|File] specification: The file content uploaded
    ###
    def self.from_file(specification)
      new(file_content: specification)
    end

    def to_jsonld
      { "@context": context, "@graph": graph }
    end

    ###
    # @description: We will work only with a json-ld file that contains both a '@context' and a '@graph'.
    #   - CASE A: It can be the case of a file only containing a graph (without a context), so we set the context
    #   to an empty entry.
    #   - CASE B: It also might be possible to deal with a file with only nodes (an array of terms of any type),
    #   so we both set the context as an empty entry and wrap the whole array into a '@graph' key.
    # @param [String|Hash] spec
    # @return [Hash]
    ###
    def validate_spec_format(spec)
      spec = JSON.parse(spec) if spec.is_a?(String)
      spec = spec.with_indifferent_access if spec.is_a?(Hash)

      # CASE A
      if spec.is_a?(Hash)
        @context = spec["@context"] || {}
        @graph = spec["@graph"] || []
      end

      # CASE B
      return unless spec.is_a?(Array)

      @context = {}
      @graph = spec
    end
  end
end
