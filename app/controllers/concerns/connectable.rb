# frozen_string_literal: true

###
# @description: Gives the ability to get the current user data if there's any
###
module Connectable
  extend ActiveSupport::Concern

  class_methods do
    ###
    # @description: Determines whether a string corresponds to a URI or not
    # @param [String]: The string to be evaluated
    # @return [TrueClass|FalseClass]
    ###
    def uri?(string)
      uri = URI.parse(string)
      %w[http https].include?(uri.scheme)
    rescue URI::BadURIError
      false
    rescue URI::InvalidURIError
      false
    end

    ###
    # @description: The context or another needed resource may be a reference to an external json service.
    #  In those cases we fetch the content from that service.
    # @param [String] uri: The http address to fetch the content from
    # @return [String]
    ###
    def http_get uri
      HTTParty.get(uri)
    end
  end
end
