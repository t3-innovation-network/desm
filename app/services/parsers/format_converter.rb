# frozen_string_literal: true

module Parsers
  ###
  # @description: This class is responsible for converting the specifications format to be json-ld
  #   We support RFD, XML, JSON formats, but internally we only work with json-ld, so we need to
  #   work with data in this format and this class will manage the conversion for us.
  ###
  # rubocop:disable Style/RescueStandardError
  class FormatConverter
    CONVERTERS = {
      csv: Converters::Ceds,
      json: Converters::RdfJson,
      nt: Converters::Turtle,
      rdf: Converters::RdfXml,
      ttl: Converters::Turtle,
      xml: Converters::XmlSchema,
      xsd: Converters::XmlSchema,
      zip: Converters::JsonSchemaZip
    }.freeze

    ###
    # @description:
    # @param [ActionDispatch::Http::UploadedFile]: the file to be converted
    # @return [Hash]
    ###
    def self.convert_to_jsonld(file)
      extension = File.extname(file).delete(".").downcase.strip
      converter = CONVERTERS[extension.to_sym]
      return File.read(file) unless converter

      converter.convert(file)
    rescue => e
      raise StandardError, "Failed to convert #{File.basename(file.path)} to JSON-LD: #{e.message}"
    end

    def self.convert_content_to_jsonld(content: nil, file: nil, url: nil, **_options) # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
      raise ArgumentError, "There is no data to upload" if content.blank? && url.present?
      raise ArgumentError, "No file or URL provided for conversion" if file.blank? && url.blank?

      extension = if file
                    File.extname(file).delete(".").downcase.strip
                  else
                    # get extension from url
                    SchemeDefinitionFetchable.infer_extension(url)&.sub(/^\./, "")
                  end
      converter = CONVERTERS[extension.to_sym]
      raise ArgumentError, "Unsupported file type: #{extension}" unless converter.present?

      if file.blank?
        file = Tempfile.new(["tmpcontentfile", ".#{extension}"])
        file.write(extension == "zip" ? content : content.force_encoding("UTF-8"))
        file.rewind
      end
      converter.convert(file)
    rescue => e
      content_path = file.present? ? File.basename(file.path) : url
      raise StandardError, "Failed to convert #{content_path} to JSON-LD: #{e.message}"
    end

    def self.find_converter(file)
      CONVERTERS.values.find do |reader|
        reader.read(file.path)
      rescue Converters::ParseError
        false
      end
    end
  end
  # rubocop:enable Style/RescueStandardError
end
