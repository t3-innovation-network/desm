# frozen_string_literal: true

# == Schema Information
#
# Table name: properties
#
#  id              :bigint           not null, primary key
#  comment         :text
#  domain          :jsonb
#  label           :string
#  path            :string
#  range           :jsonb
#  scheme          :string
#  selected_domain :string
#  selected_range  :string
#  source_uri      :string
#  subproperty_of  :string
#  uri             :string
#  value_space     :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  term_id         :bigint           not null
#
# Indexes
#
#  index_properties_on_term_id  (term_id)
#
# Foreign Keys
#
#  fk_rails_...  (term_id => terms.id) ON DELETE => cascade
#
require "rails_helper"

describe Property do
  it { is_expected.to belong_to(:term) }
end
