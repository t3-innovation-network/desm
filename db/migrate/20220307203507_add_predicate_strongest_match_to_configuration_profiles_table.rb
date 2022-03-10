class AddPredicateStrongestMatchToConfigurationProfilesTable < ActiveRecord::Migration[6.0]
  def change
    change_table :configuration_profiles do |t|
      t.string :predicate_strongest_match
    end
  end
end
