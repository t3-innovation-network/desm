# frozen_string_literal: true

require_relative "helpers"

FactoryBot::SyntaxRunner.class_eval do
  include RSpec::Rails::FileFixtureSupport
  include JsonHelpers
end
