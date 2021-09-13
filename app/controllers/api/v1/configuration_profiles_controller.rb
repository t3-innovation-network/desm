# frozen_string_literal: true

class Api::V1::ConfigurationProfilesController < ApplicationController
  before_action :with_instance, only: :destroy

  def index
    cps = ConfigurationProfile.order(name: :asc)

    render json: cps, include: [standards_organizations: {include: :users}]
  end

  def destroy
    @instance.remove!

    render json: {
      success: true
    }
  end
end
