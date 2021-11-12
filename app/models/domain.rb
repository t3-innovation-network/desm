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
  belongs_to :domain_set
  belongs_to :spine, class_name: "Specification", dependent: :destroy, optional: true
  validates :uri, presence: true, uniqueness: true
  validates :pref_label, presence: true

  ###
  # @description: Return whether a domain has a spine specification uploaded
  # @return [TrueClass|FalseClass]
  ###
  def spine?
    !spine.nil?
  end
end
