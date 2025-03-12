# frozen_string_literal: true

class SpecificationSerializer < ApplicationSerializer
  attributes :selected_domains_from_file, :slug, :use_case, :version

  attribute :domain do
    params[:base] ? nil : object.domain
  end
end
