# frozen_string_literal: true

###
# @description: Return Json terms by slug
###
module Resources
  class TermsController < ApplicationController
    def show
      term = Term.find_by_slug!(params[:slug])

      render json: term.raw
    end
  end
end
