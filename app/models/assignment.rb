# frozen_string_literal: true

# == Schema Information
#
# Table name: assignments
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  role_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_assignments_on_role_id  (role_id)
#  index_assignments_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (role_id => roles.id)
#  fk_rails_...  (user_id => users.id)
#

###
# @description: Represents an intermediate relation between a user
#   and its many possible roles
###
class Assignment < ApplicationRecord
  belongs_to :user
  belongs_to :role
end
