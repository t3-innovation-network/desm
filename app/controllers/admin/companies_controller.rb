# frozen_string_literal: true

###
# @description: Place all the actions related to companies
###
class Admin::CompaniesController < ApplicationController
  # We use a different template for this controller, in order the make a
  # difference between the public and the restricted html templates
  layout "admin"
end
