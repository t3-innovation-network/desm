# frozen_string_literal: true

require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
  describe "welcome" do
    let(:user) { FactoryBot.build(:user) }
    let(:mail) { UserMailer.with(user: user).welcome }

    it "renders the headers" do
      expect(mail.subject).to eq(I18n.t("mailers.welcome.subject"))
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq([Rails.configuration.action_mailer.default_options[:from]])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match(I18n.t("mailers.welcome.title"))
    end
  end

  describe "forgot_pass" do
    let(:user) { FactoryBot.build(:user) }
    let(:mail) { UserMailer.with(user: user).forgot_pass }

    it "renders the headers" do
      expect(mail.subject).to eq(I18n.t("mailers.forgot_pass.subject"))
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq([Rails.configuration.action_mailer.default_options[:from]])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match(I18n.t("mailers.forgot_pass.title"))
    end
  end
end
