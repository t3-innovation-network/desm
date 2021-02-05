# frozen_string_literal: true

require "rails_helper"

describe Mapping, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:mapping)).to be_valid
  end

  it { should validate_presence_of(:name) }
  it { should belong_to(:user) }

  describe ".remove_alignments_mapped_terms" do
    subject { FactoryBot.create(:mapping, status: 1) }
    let(:predicate) { FactoryBot.build(:predicate) }

    it "has empty alignments after it is marked back as 'uploaded'" do
      # Randomly make the alignments
      subject.terms.each {|alignment|
        alignment.predicate_id = predicate
        alignment.update_mapped_terms([
                                        subject.specification.terms.map(&:id).sample
                                      ])
      }

      # This should trigger the around_update hook called remove_alignments_mapped_terms
      subject.status = 0
      subject.save!

      alignment = subject.terms.first

      expect(alignment.predicate_id).to be_nil
      expect(alignment.mapped_terms).to be_empty
    end
  end
end
