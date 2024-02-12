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
class RdfsClassNode < ApplicationRecord
  validates :uri, presence: true, uniqueness: true
  validates :definition, presence: true
end
