# frozen_string_literal: true

require "rails_helper"

RSpec.describe MappingMailer do
  describe "updated" do
    let(:mapping) { build(:mapping) }
    let(:user) { build(:user) }
    let(:mail) { described_class.with(mapping:, user:).updated }

    it "renders the headers and the body" do
      expect(mail.subject).to eq(I18n.t("mailers.mapping_updated.subject"))
      expect(mail.to).to eq([user.email])
      # expect(mail.from).to eq([Rails.configuration.action_mailer.default_options[:from]])
      expect(mail.body.encoded).to match(I18n.t("mailers.mapping_updated.title"))
    end
  end
end
