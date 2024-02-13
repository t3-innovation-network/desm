# frozen_string_literal: true

require "vcr"

VCR.configure do |config|
  config.around_http_request do |request|
    VCR.use_cassette(request.uri, &request)
  end

  config.cassette_library_dir = Rails.root.join("spec", "fixtures", "vcr")
  config.hook_into :webmock
end
