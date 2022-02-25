# frozen_string_literal: true

###
# @description: Return Json abstract class sets by slug
###
class Resources::AbstractClassSetsController < ApplicationController
  def index
    list = DomainSet.all.map {|ds|
      {
        uri: ds.uri,
        concepts: ds.domains.map(&:uri).sort
      }
    }

    render json: list
  end

  def show
    set = DomainSet.find_by_slug!(params[:slug])

    render json: set.to_json_ld
  end
end
