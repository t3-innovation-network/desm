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
require "rails_helper"

describe Assignment do
  specify(:aggregate_failures) do
    expect(subject).to belong_to(:user)
    expect(subject).to belong_to(:role)
  end
end
