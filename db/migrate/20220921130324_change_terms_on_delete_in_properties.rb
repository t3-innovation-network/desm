class ChangeTermsOnDeleteInProperties < ActiveRecord::Migration[6.0]
  def change
    remove_reference :properties, :term

    add_reference :properties,
                  :term,
                  foreign_key: { on_delete: :cascade },
                  null: false
  end
end
