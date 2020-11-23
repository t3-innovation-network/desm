# frozen_string_literal: true

Rails.application.config.session_store(
  :cookie_store,
  domain: URI(ENV["API_URL"]).host,
  key: "_authentication_app"
)
