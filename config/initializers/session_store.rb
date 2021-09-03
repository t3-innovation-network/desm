# frozen_string_literal: true

Rails.application.config.session_store(
  :cookie_store,
  domain: URI(Desm::API_URL).host,
  key: "_authentication_app"
)
