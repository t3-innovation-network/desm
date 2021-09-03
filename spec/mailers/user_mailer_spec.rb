# frozen_string_literal: true

require "rails_helper"

# @todo: Enable when the GitHub action is configured to mail with secrets (email & password for
#   the sender account and Mailgun api key)
RSpec.describe UserMailer, type: :mailer do
  describe "welcome" do
    let(:user) { FactoryBot.build(:user) }
    let(:mail) { UserMailer.with(user: user).welcome }

    xit "renders the headers" do
      expect(mail.subject).to eq(I18n.t("mailers.welcome.subject"))
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq([Rails.configuration.action_mailer.default_options[:from]])
    end

    xit "renders the body" do
      expect(mail.body.encoded).to match(I18n.t("mailers.welcome.title"))
    end
  end

  describe "forgot_pass" do
    let(:user) { FactoryBot.build(:user) }
    let(:mail) { UserMailer.with(user: user).forgot_pass }

    xit "renders the headers" do
      expect(mail.subject).to eq(I18n.t("mailers.forgot_pass.subject"))
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq([Rails.configuration.action_mailer.default_options[:from]])
    end

    xit "renders the body" do
      expect(mail.body.encoded).to match(I18n.t("mailers.forgot_pass.title"))
    end
  end
end
