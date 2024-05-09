# frozen_string_literal: true

###
# @description: Return Json terms by slug
###
module Resources
  class TermsController < ApplicationController
    include Decodable

    def show
      term = Term.find_by_slug!(decoded_slug)

      render json: term.raw
    end
  end
end
