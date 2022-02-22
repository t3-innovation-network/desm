# frozen_string_literal: true

###
# @description: Return Json terms by slug
###
class Resources::TermsController < ApplicationController
  def show
    term = Term.find_by_slug!(params[:slug])

    render json: term.raw
  end
end
