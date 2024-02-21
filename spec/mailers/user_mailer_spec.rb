# frozen_string_literal: true

require "rails_helper"

RSpec.describe UserMailer do
  describe "welcome" do
    let(:user) { create(:user) }
    let(:mail) { described_class.with(user:).welcome }

    it "renders the headers  and the body" do
      expect(mail.subject).to eq(I18n.t("mailers.welcome.subject"))
      expect(mail.to).to eq([user.email])
      # expect(mail.from).to eq([Rails.configuration.action_mailer.default_options[:from]])
      expect(mail.body.encoded).to match(I18n.t("mailers.welcome.title"))
    end
  end

  describe "forgot_pass" do
    let(:user) { build(:user) }
    let(:mail) { described_class.with(user:).forgot_pass }

    it "renders the headers and the body" do
      expect(mail.subject).to eq(I18n.t("mailers.forgot_pass.subject"))
      expect(mail.to).to eq([user.email])
      # expect(mail.from).to eq([Rails.configuration.action_mailer.default_options[:from]])
      expect(mail.body.encoded).to match(I18n.t("mailers.forgot_pass.title"))
    end
  end
end
