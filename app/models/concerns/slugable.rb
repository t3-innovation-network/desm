# frozen_string_literal: true

module Slugable
  extend ActiveSupport::Concern

  included do
    before_save :generate_slug
    validates :name, presence: true
  end

  def generate_slug
    self.slug = uri_safe(name)
  end

  def uri
    "#{Desm::APP_DOMAIN}/resources/#{class_uri}/#{slug}"
  end

  private

  def uri_safe(str)
    URI.encode_www_form_component(str)
  end

  def class_uri
    classname = self.class.const_defined?("ALIAS_CLASSNAME") ? self.class::ALIAS_CLASSNAME : self.class.name
    uri_safe(classname.pluralize.underscore.humanize.gsub(" ", "-").downcase)
  end
end
