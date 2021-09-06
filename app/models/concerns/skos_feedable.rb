# frozen_string_literal: true

module SkosFeedable
  def fetch_definition uri
    repository = RDF::Repository.load(uri)

    rdf_to_json_definition(repository.to_rdf_json)
  end

  def rdf_to_json_definition rdf_json_definition
    file = Tempfile.new("temp_skos_file")
    file.write(rdf_json_definition.to_json)
    file.rewind

    Converters::RdfJson.convert(file)
  end
end
