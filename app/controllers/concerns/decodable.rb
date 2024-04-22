# frozen_string_literal: true

module Decodable
  def decode_param(param)
    Slugable.decode_safe_uri(param)
  end

  def decoded_slug
    decode_param(params[:slug])
  end
end
