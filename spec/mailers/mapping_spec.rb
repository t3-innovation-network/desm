# frozen_string_literal: true

require "rails_helper"

RSpec.describe MappingMailer, type: :mailer do
  describe "updated" do
    let(:mapping) { FactoryBot.build(:mapping) }
    let(:user) { FactoryBot.build(:user) }
    let(:mail) { MappingMailer.with(mapping: mapping, user: user).updated }

    it "renders the headers" do
      expect(mail.subject).to eq(I18n.t("mailers.mapping_updated.subject"))
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq([Rails.configuration.action_mailer.default_options[:from]])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match(I18n.t("mailers.mapping_updated.title"))
    end
  end
end
