# frozen_string_literal: true

require "rails_helper"

describe Assignment, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:role) }
end
