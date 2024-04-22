# frozen_string_literal: true

module Resources
  class BaseController < API::BaseController
    def policy_scope(scope)
      super([:resources, scope])
    end

    def authorize(record, query = nil, policy_class: nil)
      super([:resources, record], query, policy_class:)
    end
  end
end
