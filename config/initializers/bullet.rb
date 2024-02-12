# frozen_string_literal: true

if Rails.env.development? || Rails.env.test?
  require "bullet"

  Bullet.enable = true
  Bullet.bullet_logger = true
  Bullet.rails_logger = true
end
