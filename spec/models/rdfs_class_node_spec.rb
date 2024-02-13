# frozen_string_literal: true

# == Schema Information
#
# Table name: rdfs_class_nodes
#
#  id         :bigint           not null, primary key
#  definition :jsonb
#  uri        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_rdfs_class_nodes_on_uri  (uri) UNIQUE
#
require "rails_helper"

RSpec.describe RdfsClassNode do
  it "validates presence&uniqueness" do
    is_expected.to validate_presence_of(:uri)
    is_expected.to validate_presence_of(:definition)
    is_expected.to validate_uniqueness_of(:uri)
  end
end
