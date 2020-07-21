# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    @current_page = t("home.navigation.view_mappings")
  end
end
