# frozen_string_literal: true

###
# @description: Represents a node of a specification
###
class Term < ApplicationRecord
  belongs_to :specification
  has_one :property, dependent: :destroy
  has_and_belongs_to_many :vocabularies

  validates :uri, presence: true

  accepts_nested_attributes_for :property, allow_destroy: true

  ###
  # @description: Build and return the uri with the "desm" prefix
  # @return [String]: the desm namespaced uri
  ###
  def desm_uri
    "desm:#{uri.split(':').last}"
  end
end
