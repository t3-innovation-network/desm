# frozen_string_literal: true

class Api::V1::ConfigurationProfilesController < ApplicationController
  def index
    cps = ConfigurationProfile.order(name: :asc)

    render json: cps, include: [standards_organizations: {include: :users}]
  end
end
