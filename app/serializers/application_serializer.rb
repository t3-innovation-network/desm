# frozen_string_literal: true

class ApplicationSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at

  private

  def params
    @instance_options.except(:scope, :root) || {}
  end
end
