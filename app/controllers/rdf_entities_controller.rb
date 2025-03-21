# frozen_string_literal: true

class RdfEntitiesController < ApplicationController
  delegate :configuration_profile, to: :entity

  def abstract_class_mapping
    redirect_to build_url(
      path: "/mappings-list",
      params: { abstractClass: entity.domain }
    )
  end

  def property
    spine = entity.spines.first

    domain =
      if spine
        spine.domain.pref_label
      else
        Alignment
          .joins(:mapped_terms)
          .where(terms: { id: entity })
          .first
          .mapping
          .domain
      end

    redirect_to build_url(
      path: "/mappings-list",
      params: { abstractClass: domain },
      fragment: entity.id
    )
  end

  def term_mapping
    redirect_to build_url(
      path: "/mappings-list",
      params: { abstractClass: entity.domain },
      fragment: entity.spine_term_id
    )
  end

  private

  def build_url(path:, params: {}, fragment: nil)
    url = URI(ENV.fetch("APP_DOMAIN"))
    url.path = path
    url.query = URI.encode_www_form(params.merge(cp: configuration_profile.id))
    url.fragment = fragment.to_s
    url
  end

  def entity
    @entity ||= begin
      klass =
        case action_name
        when "abstract_class_mapping" then Mapping
        when "property" then Term
        when "term_mapping" then Alignment
        else raise "Unsupported action"
        end

      klass.find(params[:id])
    end
  end
end
