# frozen_string_literal: true

class NormalizedParams < OpenStruct # rubocop:todo Style/OpenStructUse
  def initialize(params)
    params = params.dup.to_h
    params.deep_transform_keys! { |key| key.to_s.underscore.to_sym }
    params.deep_transform_values! do |value|
      case value
      when "true"
        true
      when "false"
        false
      else
        value
      end
    end

    super(params)
  end
end
