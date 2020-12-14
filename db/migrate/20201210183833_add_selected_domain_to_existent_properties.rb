# frozen_string_literal: true

class AddSelectedDomainToExistentProperties < ActiveRecord::Migration[6.0]
  def change
    # The selected domain should exist. It can be one of the list of the available ones
    Property.update_all("selected_domain = domain->>0")
  end
end
