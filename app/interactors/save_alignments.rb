# frozen_string_literal: true

class SaveAlignments
  include Interactor

  delegate :mapping, :adds, to: :context
  delegate :spine, to: :mapping

  before do
    context.adds = []
  end

  def call
    Alignment.transaction do
      context.alignments.each do |params|
        if params[:id].present?
          update(params)
        else
          create_synthetic(params)
        end
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    context.fail!(error: e.record.errors.full_messages.join(". "))
  rescue ArgumentError => e
    context.fail!(error: e.message)
  end

  private

  def create_alignments_for_existing_mappings(term)
    spine.mappings.where.not(id: mapping).each do |mapping|
      mapping.alignments.create!(spine_term: term, uri: term.uri)
    end
  end

  def create_synthetic(params)
    term = Term.find(params.fetch(:mapped_term_ids).first)
    uri = "#{term.uri}-synthetic"
    comment = "Alignment for a synthetic property added to the spine. " \
              "Synthetic uri: #{uri}"

    begin
      spine.terms << term
    rescue ActiveRecord::RecordNotUnique => e
      Rails.logger.error(e.inspect)
      context.fail!(error: I18n.t("errors.synthetic.spine_term_not_uniq", term: term.name))
    end

    context.adds << mapping.alignments.create!(
      comment:,
      spine_term: term,
      synthetic: true,
      uri:,
      **params.slice(:mapped_term_ids, :predicate_id)
    )

    create_alignments_for_existing_mappings(term)
  end

  def update(params)
    mapping
      .alignments
      .find(params.fetch(:id))
      .update!(params.slice(:mapped_term_ids, :predicate_id))
  end
end
