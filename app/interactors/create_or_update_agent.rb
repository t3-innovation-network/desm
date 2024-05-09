# frozen_string_literal: true

class CreateOrUpdateAgent
  include Interactor

  before do
    context.fail!(error: "Email must be present") unless context.email.present?
    context.fail!(error: "Invalid email format") unless URI::MailTo::EMAIL_REGEXP.match(context.email)
    context.fail!(error: "Fullname must be present") unless context.fullname.present?
    context.fail!(error: "Role must be present") unless context.role.present?
  end

  def call
    agent = User.find_or_initialize_by(email: user_params[:email])
    agent.update!(agent_params_for(agent))

    Assignment.find_or_create_by!(role: context.role, user: agent)

    context.agent = agent
  rescue StandardError => e
    Rails.logger.error(e.inspect)
    context.fail!(error: e.message)
  end

  private

  def agent_params_for(agent)
    return user_params if agent.persisted?

    user_params.merge(password: Desm::DEFAULT_PASS)
  end

  def user_params
    @user_params = context.to_h.slice(:fullname,
                                      :email,
                                      :phone,
                                      :github_handle,
                                      :skip_validating_organization)
  end
end
