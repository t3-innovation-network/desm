# frozen_string_literal: true

class MappingMailer < ApplicationMailer
  before_action :set_params

  ###
  # @description: Notify the user about a change in a mapping related
  #   to the user's work
  ###
  def updated
    @title = t("mailers.mapping_updated.title")
    @url = "#{@config[:host]}/mappings/#{@mapping.id}"

    mail(to: @user.email, subject: t("mailers.mapping_updated.subject"))
  end

  ###
  # @description: Instantiate the user from params
  ###
  def set_params
    @mapping = params[:mapping]
    @user = params[:user]
  end
end
