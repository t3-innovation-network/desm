# frozen_string_literal: true

class RdfsClassNode < ApplicationRecord
  validates :uri, presence: true, uniqueness: true
  validates :definition, presence: true
end
