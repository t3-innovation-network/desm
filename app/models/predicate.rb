# frozen_string_literal: true

###
# @description: Represents a Predicate, which is a way to identify the nature / quality
# of the mapping between the spine term and mapped term.
#
# E.g.:
#   - "Identical",
#   - "Reworded",
#   - "Agreggated",
#   - "Dissagreggated",
#   - "Intent",
#   - "Concept",
#   - "No Match",
#   - "Not Applicable",
###
class Predicate < ApplicationRecord
  belongs_to :predicate_set
  validates :uri, presence: true, uniqueness: true
  validates :pref_label, presence: true
  before_create :assign_color, unless: :color?
  before_save :default_values

  MAX_ALLOWED_WEIGHT = 5
  MIN_ALLOWED_WEIGHT = 0

  ###
  # @description: Map of labels
  ###
  DEFAULT_LABELS = {
    aggregated: "aggregated",
    concept: "concept",
    disaggregated: "disaggregated",
    identical: "identical",
    issue: "issue",
    no_match: "no match",
    not_applicable: "not applicable",
    reworded: "reworded",
    similar: "similar"
  }.freeze

  ###
  # @description: Map of colors
  ###
  COLORS = {
    dark_blue: "DarkBlue",
    dark_green: "DarkGreen",
    light_blue: "LightBlue",
    light_green: "LimeGreen",
    orange: "Orange",
    red: "Red",
    pink: "Pink",
    unset: "unset",
    yellow: "Yellow"
  }.freeze

  ###
  # @description: Map of weights and colors. These colors for predicates depending on weights is
  #   an agreement from a github issue.
  # @see https://github.com/t3-innovation-network/desm/issues/72
  ###
  WEIGHT_COLORS = {
    0 => {
      DEFAULT_LABELS[:no_match] => COLORS[:red],
      DEFAULT_LABELS[:not_applicable] => COLORS[:unset]
    },
    1 => {
      DEFAULT_LABELS[:issue] => COLORS[:pink]
    },
    2 => {
      DEFAULT_LABELS[:concept] => COLORS[:orange]
    },
    3 => {
      DEFAULT_LABELS[:disaggregated] => COLORS[:light_blue],
      DEFAULT_LABELS[:aggregated] => COLORS[:dark_blue]
    },
    4 => {
      DEFAULT_LABELS[:similar] => COLORS[:yellow]
    },
    5 => {
      DEFAULT_LABELS[:reworded] => COLORS[:light_green],
      DEFAULT_LABELS[:identical] => COLORS[:dark_green]
    }
  }.freeze

  ###
  # @description: Assigns a color depending on the weight and the label
  #   NOTE: This logic may change in future phases of this project to let an admin select the color
  #   using the dashboard.
  ###
  def assign_color
    self.color = weight_to_color
  end

  private

  def default_values
    self.weight ||= 0
  end

  ###
  # @description: Returns the color string for this predicate instance
  # @return [String]
  ###
  def weight_to_color
    # Validate weight is inside the permitted range, and the label is in the collection of default
    # labels, otherwise do not assign a color.
    return nil unless weight_is_valid? && label_is_valid?

    WEIGHT_COLORS.dig(weight.to_i, pref_label.downcase)
  end

  ###
  # @description: Determines the validity of the weight
  # @return [TrueClass|FalseClass]
  ###
  def weight_is_valid?
    (MIN_ALLOWED_WEIGHT..MAX_ALLOWED_WEIGHT).include?(weight.to_i)
  end

  ###
  # @description: Determines the validity of the label.
  # @return [TrueClass|FalseClass]
  ###
  def label_is_valid?
    snake_cased_label = pref_label.parameterize.underscore

    DEFAULT_LABELS.keys.include?(snake_cased_label.to_sym)
  end
end
