# frozen_string_literal: true

class CreateSyntheticTerm
  include Interactor

  def call
    Alignment.transaction do
      spine.terms << term
      context.alignment = Alignment.create!(alignment_params)
      create_alignments_for_existing_mappings
    end
  end

  private

  def alignment_params
    context.params.fetch(:alignment).merge(spine_term_id: term.id)
  end

  def create_alignments_for_existing_mappings
    spine.mappings.where.not(id: context.alignment.mapping_id).each do |mapping|
      mapping.alignments.create!(spine_term_id: term.id, uri: term.uri)
    end
  end

  def spine
    @spine ||= Spine.find(context.params.fetch(:spine_id))
  end

  def term
    @term ||= Term.find(context.params.fetch(:spine_term_id))
  end
end
