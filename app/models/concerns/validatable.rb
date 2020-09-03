# frozen_string_literal: true

###
# @description: Includes additional validation logic with options like printing
#   messages to the screen if a validation is not correct
###
module Validatable
  ###
  # @description: Validate the existence of an object in the database
  #
  # @param [Class] object_class The class for the object to validated
  # @param [Object] object The object to validated, it's a generic object so the
  #   class couldn't be inferred from it
  ###
  def already_exists?(object_class, object, print_message: false)
    exists = object_class.exists?(uri: object[:id])
    if exists && print_message
      puts "\n- #{object_class} with uri: '#{object[:id]}' already exists in our records, ignoring"
    end
    exists
  end
end
