# frozen_string_literal: true

class BaseQuery
  def self.call(scope, params: {}, pagination: nil)
    new(scope, params:, pagination:).call
  end

  def initialize(scope, params: {}, pagination: nil)
    @scope = scope
    @q = NormalizedParams.new(params)
    @pagination = pagination
  end

  private

  attr_reader :q, :scope, :pagination

  def apply_filters
    raise NotImplementedError
  end

  def sorted_scope
    raise NotImplementedError
  end
end
