# frozen_string_literal: true

class Spine < ApplicationRecord
  include Slugable

  belongs_to :domain
  belongs_to :organization
  has_and_belongs_to_many :terms
  has_many :mappings

  def to_json_ld
    {
      name: name,
      uri: uri,
      domain: domain.uri,
      terms: terms.map(&:uri).sort
    }
  end
end
