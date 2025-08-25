# frozen_string_literal: true

module Converters
  # Converts JSON schema to the JSON-LD format
  class JsonSchema < JsonSchemaZip
    def self.read(path)
      JSON(File.read(path))
      true
    rescue JSON::ParserError
      raise Converters::ParseError
    end

    private

    def build_from(file)
      Dir.mktmpdir do |temp_dir|
        path = File.join(temp_dir, File.basename(file))
        File.binwrite(path, file.read)

        SchemaTools.schema_path = temp_dir
        SchemaTools::Reader.read_all.each do |schema|
          build_object_resources(schema.absolute_filename, schema.to_h)
        end
      end
    end
  end
end
