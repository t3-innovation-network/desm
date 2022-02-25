# frozen_string_literal: true

Rails.application.config.session_store(
  :cookie_store,
  domain: URI(Desm::APP_DOMAIN).host,
  key: "_authentication_app"
)
