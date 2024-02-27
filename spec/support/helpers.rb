# frozen_string_literal: true

module JsonHelpers
  def json_fixture(file_name)
    JSON.parse(file_fixture(file_name).read)
  end
end

RSpec.configure do |config|
  config.include JsonHelpers
end
