# frozen_string_literal: true

class PagesController < ApplicationController
  # Let the user see the home page without authentication
  skip_before_action :authenticate_user!, only: [:home]

  def home
    @current_page = t("home.navigation.view_mappings")
  end
end
