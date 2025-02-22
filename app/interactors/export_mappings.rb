# frozen_string_literal: true

class ExportMappings
  include Interactor
  include FsSanitizable

  delegate :configuration_profile, :domains, :format, :mapping, to: :context

  def call
    case format
    when "csv" then export_csv
    when "jsonld" then export_jsonld
    when "ttl" then export_turtle
    else context.fail!(error: "Unsupported format: `#{format}`")
    end

    context.filename = "#{filename}.#{extension}"
  end

  def bulk_export?
    domains.any?
  end

  def filename
    @filename ||= bulk_export? ? bulk_export_filename : mapping.export_filename
  end

  def export_csv
    context.content_type = bulk_export? ? "application/zip" : "text/csv"

    context.data =
      if bulk_export?
        io = StringIO.new

        Zip::OutputStream.write_buffer(io) do |zip|
          mappings.each do |mapping|
            zip.put_next_entry("#{mapping.export_filename}.csv")
            zip.write(Exporters::Mapping.new(mapping).csv)
          end
        end

        io.rewind
        io.string
      else
        exporter.csv
      end
  end

  def export_jsonld
    context.content_type = "application/ld+json"
    context.data = jsonld_data
  end

  def export_turtle
    context.content_type = "text/turtle"
    context.data = turtle_data
  end

  def exporter
    Exporters::Mapping.new(mapping)
  end

  def extension
    bulk_export? && format == "csv" ? "zip" : format
  end

  def jsonld_data
    @jsonld_data ||= if bulk_export?
                       {
                         "@context": Desm::CONTEXT,
                         "@graph": mappings.map { Exporters::Mapping::JSONLD.new(_1).graph }.flatten.uniq
                       }.to_json
                     else
                       exporter.jsonld.to_json
                     end
  end

  def mappings
    @mappings ||=
      begin
        relation = configuration_profile.mappings.mapped.select(:id)

        if bulk_export?
          relation = relation
                       .joins(:specification)
                       .where(specifications: { domain_id: domains })
        end

        relation.where!(id: mapping) if mapping.present?

        mappings = Mapping
                     .where(id: relation)
                     .includes(
                       alignments: [
                         :predicate,
                         { mapped_terms: :property },
                         { spine_term: :property }
                       ],
                       specification: :domain
                     )

        if format == "csv"
          mappings.includes(:configuration_profile)
        else
          mappings
        end
      end
  end

  def turtle_data
    @turtle_data ||= begin
      repository = RDF::Repository.new

      JSON::LD::Reader.new(jsonld_data) do |reader|
        reader.each_statement do |statement|
          repository << statement
        end
      end

      RDF::Writer.for(:turtle).buffer do |writer|
        repository.each_statement do |statement|
          writer << statement
        end
      end
    end
  end

  private

  #
  # @description: Generates a filename for the bulk export
  # Format is [project_name][abstract_classes joined by '_']_[latest timestamp from mappings],
  # abstract classes should be "all" if all abstract classes were selected.
  #
  # @return [String]
  #
  def bulk_export_filename
    # get latest timestamp from mappings
    updated_at = mappings.map(&:updated_at).max
    abstract_classes = if configuration_profile.domains.size == domains.size
                         "all"
                       else
                         domains.map { |d| d.name.tr(" ", "+") }.join("_")
                       end
    ary_to_filename(
      [
        configuration_profile.name,
        abstract_classes,
        timestamp_for(updated_at)
      ]
    )
  end
end
