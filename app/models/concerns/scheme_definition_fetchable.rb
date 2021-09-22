# frozen_string_literal: true
require 'open-uri'

module SchemeDefinitionFetchable
  def fetch_definition uri
    file_content = URI.open(uri).read
    file = Tempfile.new(["tmpschemfile", File.extname(uri)])
    file.write(file_content)
    file.rewind

    Parsers::FormatConverter.convert_to_jsonld(file)
  end
end
