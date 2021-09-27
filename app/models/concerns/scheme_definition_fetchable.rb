# frozen_string_literal: true

require "open-uri"

module SchemeDefinitionFetchable
  EXTENSIONS = {
    "application/rdf+xml": ".rdf",
    "application/json": ".json",
    "text/csv": ".csv",
    "application/zip": ".zip",
    "application/xml": ".xml",
    "text/xml": ".xml",
  }

  def fetch_definition uri
    file_content = URI.open(uri).read
    ext = infer_extension(uri)
    file = Tempfile.new(["tmpschemfile", infer_extension(uri)])
    file.write(file_content)
    file.rewind

    Parsers::FormatConverter.convert_to_jsonld(file)
  end

  private

  def infer_extension uri
    ext = File.extname(uri)
    return ext if ext.present?

    response = HTTParty.get(uri)
    EXTENSIONS[response.headers.content_type.to_sym]
  end
end
