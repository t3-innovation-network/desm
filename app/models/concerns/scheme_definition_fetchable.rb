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

  def fetch_definition(uri)
    return {} unless valid_uri?(uri)

    file = temp_file(uri)
    converter = Parsers::FormatConverter.find_converter(file)
    raise ArgumentError, "Converter not found for schema: `#{uri}`" unless converter

    converter.convert(file)
  end

  ###
  # @description: If the context is a reference to an external service endpoint, go get it
  # @return [Hash,String]
  ###
  def resolve_context
    # Try resolving with an http request
    JsonContext.fetch(@context)
  rescue JSON::ParserError
    raise ArgumentError, "Failed to resolve context. Make sure `#{@context}` responds with JSON"
  end

  private

  def valid_uri?(uri)
    HttpUrlValidator.valid?(uri) || File.exist?(uri)
  end

  def temp_file(uri)
    file = Tempfile.new(["tmpschemfile", infer_extension(uri)])
    file.write(fetch_content(uri).force_encoding("UTF-8"))
    file.rewind
    file
  end

  def fetch_content(uri)
    repository = RDF::Repository.load(uri)
    repository.to_rdf_json.to_json
  rescue StandardError
    URI.parse(uri).open(allow_redirections: :all).read
  end

  def infer_extension(uri)
    ext = File.extname(uri)
    return ext if ext.present?

    response = HTTParty.get(uri)
    EXTENSIONS[response.headers.content_type.to_sym]
  end
end
