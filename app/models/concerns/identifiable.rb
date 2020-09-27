# frozen_string_literal: true

###
# @description: This module defines methods that can identify a model
###
module Identifiable
  ###
  # @description: Generates a unique id based on time mark
  ###
  def unique_id
    Time.now.to_f.to_s.gsub(".", "")
  end
end
