# frozen_string_literal: true

require "open-uri"

module SchemeDefinitionFetchable
  EXTENSIONS = {
    "application/rdf+xml": ".rdf",
    "application/json": ".json",
    "text/csv": ".csv",
    "application/zip": ".zip",
    "application/xml": ".xml",
    "text/xml": ".xml"
  }.freeze

  def fetch_definition uri
    file_content = URI.open(uri).read
    file = Tempfile.new(["tmpschemfile", infer_extension(uri)])
    file.write(file_content)
    file.rewind

    converter = Parsers::FormatConverter.find_converter(file)
    converter.convert(file)
  end

  ###
  # @description: If the context is a reference to an external service endpoint, go get it
  # @return [Hash,String]
  ###
  def resolve_context
    # Try resolving with an http request
    response = http_get(@context)
    # Avoid having the context nested twice
    return response["@context"] if response && response["@context"]&.present?
    {}
  end

  private

  def infer_extension uri
    ext = File.extname(uri)
    return ext if ext.present?

    response = HTTParty.get(uri)
    EXTENSIONS[response.headers.content_type.to_sym]
  end
end
