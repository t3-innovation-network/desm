# frozen_string_literal: true

###
# @description: Manages impersonation of agents by admins
###
class ImpersonationsController < ApplicationController
  ###
  # @description: Signs in an agent and persists the current user as the impostor
  ###
  def start
    agent =
      begin
        policy_scope(User, policy_scope_class: AgentPolicy::Scope).find(params[:agent_id])
      rescue ActiveRecord::RecordNotFound
        nil
      end

    if agent
      session[:impostor_id] = current_user.id
      session[:user_id] = agent.id
    end

    redirect_to root_url
  end

  ###
  # @description: Signs in the impostor back and redirects them to the agents page
  ###
  def stop
    return redirect_to root_url unless impersonation_mode?

    session[:user_id] = session[:impostor_id]
    session[:impostor_id] = nil
    redirect_to "/dashboard/agents"
  end
end
