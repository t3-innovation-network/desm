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
#  source_path     :string
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

  describe "#update_term" do
    let(:property) { create(:property) }

    context "when label is changed" do
      it "updates the term name and property uri" do
        new_label = "New Label"
        expect do
          property.update(label: new_label)
        end.to change { property.term.name }.to(new_label)
        expect(property.uri).to eq(property.term.uri)
      end
    end

    context "when source_uri is changed" do
      it "updates the property uri" do
        new_source_uri = "https://example.com/new_source_uri"
        expect do
          property.update(source_uri: new_source_uri)
        end.to change { property.term.source_uri }.to(new_source_uri)
        expect(property.uri).to eq(property.term.uri)
      end
    end

    context "when comment is changed" do
      it "does not update the term name or property uri" do
        new_comment = Faker::Lorem.sentence
        expect do
          property.update(comment: new_comment)
        end.to change { property.term.comments }.to([new_comment])
        expect(property.uri).to eq(property.term.uri)
      end
    end

    context "when neither comment nor label nor source_uri are changed" do
      it "does not update the term name or property uri" do
        previous_uri = property.uri
        expect do
          property.update(subproperty_of: Faker::Internet.url)
        end.not_to change { property.term }
        expect(property.uri).to eq(previous_uri)
      end
    end
  end
end
