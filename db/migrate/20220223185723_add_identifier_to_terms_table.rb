class AddIdentifierToTermsTable < ActiveRecord::Migration[6.0]
  def change
    change_table :terms do |t|
      t.string :identifier
    end
  end
end
