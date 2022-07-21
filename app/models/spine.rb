# frozen_string_literal: true

class Spine < ApplicationRecord
  include Slugable

  belongs_to :domain
  belongs_to :organization
  has_and_belongs_to_many :terms
  has_many :mappings

  before_destroy :check_if_mappings_exist

  def to_json_ld
    {
      name: name,
      uri: uri,
      domain: domain.uri,
      terms: terms.map(&:uri).sort
    }
  end

  private

  def check_if_mappings_exist
    return if mappings.none?

    raise "Cannot remove a spine with existing mappings. " \
          "Please remove all mappings before removing the spine."
  end
end
