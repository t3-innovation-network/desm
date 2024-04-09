# frozen_string_literal: true

# == Schema Information
#
# Table name: merged_files
#
#  id         :bigint           not null, primary key
#  content    :jsonb            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

###
# @description: Represents a file content in json-ld format that contains both a graph
#   of terms and a context.
#
#   The graph might contain zerp or many of the following types of nodes:
#   - Properties (rdf:property)
#   - Classes (rdfs:class)
#   - Concept Schemes (skos:conceptscheme)
#   - Concepts (skos:concept)
#
#   It's used in the upload phase of this tool to manage only one file during the filtering
#   of the file.
#
#   After that phase the model has no purpose, that's why it relies on a daily task to be
#   removed in order to save space.
###
class MergedFile < ApplicationRecord
  validates :content, presence: true

  ###
  # @description: Return those MergedFiles that can be removed.
  ###
  scope :needs_removal, lambda {
    where("created_at < ?", 5.hours.ago)
  }
end
