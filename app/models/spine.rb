# frozen_string_literal: true

class Spine < ApplicationRecord
  include Slugable

  belongs_to :domain
  belongs_to :organization
  has_and_belongs_to_many :terms
  has_many :mappings
  after_create :add_basic_terms, if: proc { terms.count.zero? }

  def add_basic_terms
    %w[name description].each do |label|
      t = Term.find_by_name(label)
      terms << t if t.present?
    end
  end

  def to_json_ld
    {
      name: name,
      uri: uri,
      domain: domain.uri,
      terms: terms.map(&:uri).sort
    }
  end
end
