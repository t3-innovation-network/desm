# frozen_string_literal: true

module Parsers
  ###
  # @description: This class contains all the operations related to parse a specification
  #   Particularly, at this stage we deal with Ruby objects. It might be simple or relatively
  #   complex objects, hence the operations needed to process it.
  ###
  class Specifications
    include Connectable

    ###
    # @description: Initialize the specifications parser
    # @param [Array] specifications: The list of file contents uploaded
    ###
    def initialize specifications
      @specifications = specifications.map {|spec|
        validate_spec_format(spec)
      }
    end

    ###
    # @description: Put together the content of the uploaded files to get only one object with
    #   all the necessary data to process
    # @return [Object]: The unified specification
    ###
    def merge_specs
      final_spec = {
        "@context": {},
        "@graph": []
      }.with_indifferent_access

      @specifications.each do |spec|
        context = spec["@context"]

        # Ensure we're dealing with a hash, otherwise the "merge!" method below will not work
        context = resolve_context(context) if context.is_a?(String) && uri?(context)

        # merge the context so we have all the context info
        final_spec[:@context].merge!(context) if context

        # merge the graph so we have all the elements in one place
        final_spec[:@graph] += (spec["@graph"])
      end

      final_spec
    end

    private

    ###
    # @description: If the context is a reference to an external service endpoint, go get it
    # @param [String] context_uri: The URI to fetch the context from
    # @return [Hash]
    ###
    def resolve_context context_uri
      # Try resolving with an http request
      response = http_get(context_uri)

      # Avoid having the context nested twice
      return response["@context"] if response && response["@context"].present?

      response
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
    def validate_spec_format spec
      spec = JSON.parse(spec) if spec.is_a?(String)

      spec = spec.with_indifferent_access if spec.is_a?(Hash)

      # CASE A
      spec["@context"] = {} if spec.is_a?(Hash) && !spec["@context"].present?

      # CASE B
      if spec.is_a?(Array)
        spec = {
          "@context": {},
          "@graph": spec
        }
      end

      spec.with_indifferent_access
    end
  end
end
