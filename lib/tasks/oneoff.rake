# frozen_string_literal: true

namespace :oneoff do
  desc "One-off task: remove alignments with no corresponding term"
  task remove_inconsistent_alignments: :environment do
    # Remove alignments with no corresponding term
    term_ids = Term.ids
    Alignment.where("spine_term_id not in (?)", term_ids).destroy_all
  end
end
