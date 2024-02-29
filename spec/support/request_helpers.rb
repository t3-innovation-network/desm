# frozen_string_literal: true

module RequestHelpers
  def stub_authentication_for(user, configuration_profile: nil)
    allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
    allow_any_instance_of(ApplicationController).to receive(:current_configuration_profile)
                                                      .and_return(configuration_profile)
  end

  def json_parse(body)
    JSON.parse(body, symbolize_names: true)
  end
end

RSpec.configure do |config|
  config.include RequestHelpers, type: :request
end
