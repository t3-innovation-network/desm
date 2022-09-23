class AddLeadMapperToConfigurationProfileUser < ActiveRecord::Migration[6.0]
  def change
    add_column :configuration_profile_users,
               :lead_mapper,
               :boolean,
               default: false,
               null: false
  end
end
