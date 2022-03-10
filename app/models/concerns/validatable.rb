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
  # @param [String] uri URI of the object to validated
  ###
  def already_exists?(object_class, uri, print_message: false)
    exists = object_class.exists?(source_uri: uri)
    puts "\n- #{object_class} with uri: '#{uri}' already exists in our records, ignoring" if exists && print_message
    exists
  end
end
