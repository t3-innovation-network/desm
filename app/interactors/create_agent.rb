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
    agent = User.find_or_initialize_by(email: user_params[:email]) do |agt|
      agt.update!(user_params)
    end

    Assignment.find_or_create_by!(role: context.role, user: agent)

    context.agent = agent
  rescue StandardError => e
    context.fail!(error: e)
  end

  private

  def user_params
    @agent_params = context.to_h
                      .slice(:fullname,
                             :email,
                             :phone,
                             :github_handle,
                             :skip_validating_organization)
                      .merge({ password: Desm::DEFAULT_PASS })
  end
end
