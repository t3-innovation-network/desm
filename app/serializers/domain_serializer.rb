# frozen_string_literal: true

class DomainSerializer < ApplicationSerializer
  attributes :definition, :pref_label, :slug, :source_uri, :spine?
  has_one :spine

  def spine?
    object.spine?
  end
end
