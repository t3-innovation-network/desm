# frozen_string_literal: true

# Monkey-patches json_schema_tools to suit our needs better
module SchemaTools
  # PATCH: Support inner references, i.e. pointers starting with `#/`
  class RefResolver
    def self.load_json_pointer(json_pointer, relative_to = nil)

      if json_pointer[/#/]
        # hash-symbol syntax pointing to a property of a schema. client.json#properties
        raise ArgumentError, "invalid json pointer: #{json_pointer}" unless json_pointer =~ /^(.*)#(.*)/
        uri, pointer = json_pointer.match(/^(.*)#(.*)/).captures
      else
        uri = json_pointer
      end

      schema =
        if uri.present?
          uri = URI.parse(uri)
          raise ArgumentError, "must currently be a relative uri: #{json_pointer}" if uri.absolute?
          # TODO use local tools instance or base path from global SchemaTools.schema_path
          base_dir = relative_to ? relative_to.absolute_dir : SchemaTools.schema_path
          path = find_local_file_path(base_dir, uri.path, relative_to)
          JSON.parse(File.read(path))
        else
          relative_to.to_h
        end

      if pointer
        self._retrieve_pointer_from_object(pointer, schema)
      else
        schema
      end
    end

    def self._retrieve_pointer_from_object(pointer, object)
      # assume path to be the JSONPointer expression:
      #  json/pointer/expression
      # and obj to be the ruby hash representation of the json
      path = pointer.is_a?(Array) ? pointer : pointer.split("/")

      while object != nil && component = path.shift
        next if component.blank?

        component = component.to_i if object.is_a?(Array) && component =~ /^\d+$/
        object = object[component]
      end

      return object
    end
  end

  class Schema
    PATH_KEY = "__path__"

    # PATCH: Add a JSON path property to each object node
    def initialize(name_or_hash)
      case name_or_hash
        when (::Hash)
          @hash = name_or_hash.with_indifferent_access
        when (::String)
          src = File.open(name_or_hash, 'r') { |f| f.read }
          self.absolute_filename= name_or_hash
          decode src
      end
      add_paths
      handle_extends
      resolve_refs
    end

    private

    def add_paths(hash=@hash)
      path = hash.fetch(PATH_KEY, "$")

      hash.each do |key, value|
        next unless value.is_a?(ActiveSupport::HashWithIndifferentAccess)

        value[PATH_KEY] = "#{path}.#{key}"
        add_paths(value)
      end
    end

    # PATCH: Don't remove references after resolution
    def resolve_reference(hash, stack=[])
      json_pointer = hash["$ref"]
      if stack.include? json_pointer
        # we should probably also have a "too many levels of $ref exception or something ..."
        raise CircularReferenceException.new( absolute_filename, json_pointer, stack )
      else
        stack.push json_pointer
      end

      values_from_pointer = RefResolver.load_json_pointer(json_pointer, self)
      # recurse to resolve possible refs in object properties
      resolve_refs(values_from_pointer, stack)

      hash.merge!(values_from_pointer) { |key, old, new| old }
      stack.pop
    end
  end
end
