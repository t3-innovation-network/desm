# frozen_string_literal: true

class CreateAgent
  include Interactor

  before do
    context.fail!(error: "Email must be present") unless context.email.present?
    context.fail!(error: "Invalid email format") unless URI::MailTo::EMAIL_REGEXP.match(context.email)
    context.fail!(error: "Fullname must be present") unless context.fullname.present?
    context.fail!(error: "Role must be present") unless context.role.present?
  end

  def call
    agent = User.first_or_create!(user_params.merge(skip_sending_welcome_email: true))
    Assignment.create!(role: context.role, user: agent)

    context.agent = agent
  rescue StandardError => e
    context.fail!(error: e)
  end

  private

  def user_params
    @agent_params = context.to_h
                           .slice(:fullname, :email, :phone, :github_handle, :organization)
                           .merge({password: Desm::DEFAULT_PASS})

    sanitized_params
  end

  def sanitized_params
    @agent_params.except!(:organization) if context.dso_admin
    @agent_params
  end
end
