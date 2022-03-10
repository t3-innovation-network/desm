class AddPredicatesAndAbstractClassesToConfigurationProfilesTable < ActiveRecord::Migration[6.0]
  def change
    change_table :configuration_profiles do |t|
      t.jsonb :json_mapping_predicates
      t.jsonb :json_abstract_classes
    end
  end
end
