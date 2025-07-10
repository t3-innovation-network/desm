# frozen_string_literal: true

class VocabularySerializer < ApplicationSerializer
  def self.model_name
    ActiveModel::Name.new(self, nil, "Vocabulary")
  end

  attributes :configuration_profile_id, :content, :context, :version
  attribute :concepts, if: -> { params[:with_concepts] }

  attribute :name_with_version do
    if object.version > 1
      "#{object.name} (#{object.version})"
    else
      object.name
    end
  end
end
