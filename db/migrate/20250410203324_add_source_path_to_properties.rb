class AddSourcePathToProperties < ActiveRecord::Migration[7.2]
  def change
    add_column :properties, :source_path, :string

    reversible do |dir|
      dir.up do
        # CEDS URIs end with the element's Global ID—a number—preceded by an underscore.
        # Those numbers are extracted and added to the term's `raw` column's `desm:sourcePath` property
        execute <<~SQL
          UPDATE terms
          SET raw = jsonb_set(
            raw::jsonb,
            '{desm:sourcePath}',
            to_jsonb(regexp_replace(source_uri, '^http://desmsolutions\.org/ns/.*_(\d+)$', '\1')),
            true
          )
          WHERE source_uri ~ '^http://desmsolutions\.org/ns/.*_\d+$'
        SQL

        # Populate properties' `source_path` column with the existing `desm:sourcePath` values
        execute <<~SQL
          UPDATE properties
          SET source_path = terms.raw->>'desm:sourcePath'
          FROM terms
          WHERE term_id = terms.id
        SQL
      end
    end
  end
end
