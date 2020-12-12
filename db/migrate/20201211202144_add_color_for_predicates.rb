# frozen_string_literal: true

class AddColorForPredicates < ActiveRecord::Migration[6.0]
  def change
    change_table :predicates do |t|
      t.string :color
    end

    ###
    # @description: This change might affect existent records. The solution is to run the "assign_color" method
    #   to ensure the field is correctly populated to all those that hasn't.
    #   If, for any reason, this method doesn't remain in the future, replace it by assigning the color using
    #   the console or a rake task.
    ###
    Predicate.find_each {|p|
      next unless p.respond_to?(:assign_color) && !p.color.present?
      p.assign_color
      p.save!
    }
  end
end
