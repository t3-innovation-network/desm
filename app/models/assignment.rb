# frozen_string_literal: true

###
# @description: Represents an intermediate relation between a user
#   and its many possible roles
###
class Assignment < ApplicationRecord
  belongs_to :user
  belongs_to :role
end
