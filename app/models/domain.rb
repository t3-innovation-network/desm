# frozen_string_literal: true

###
# @description: Represents a Concept, which is a domain from a Concept Scheme
#   (also refered to as 'domain set'.
#
#   These concepts or domains are the entities related to the specifications
#   trhre users uploads. In other words, a specification must be only for one
#   domain, e.g.:
#
#   - Organization
#   - Person
#   - Course
#
#   These domains are, belongs to the "Desm Concept Scheme", which is a domain
#   set.
###
class Domain < ApplicationRecord
  include Slugable

  ALIAS_CLASSNAME = "AbstractClass"
  belongs_to :domain_set
  belongs_to :spine, class_name: "Specification", dependent: :destroy, optional: true
  validates :source_uri, presence: true, uniqueness: true
  validates :pref_label, presence: true
  alias_attribute :name, :pref_label

  ###
  # @description: Return whether a domain has a spine specification uploaded
  # @return [TrueClass|FalseClass]
  ###
  def spine?
    !spine.nil?
  end

  def to_json_ld
    json = {
      uri: uri,
      source_uri: source_uri,
      pref_label: pref_label,
      definition: definition
    }
    json[:spine] = spine.uri if spine?

    json
  end
end
