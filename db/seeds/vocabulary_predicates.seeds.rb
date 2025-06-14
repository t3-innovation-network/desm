# frozen_string_literal: true

predicate_set = PredicateSet.find_or_create_by!(title: Desm::VOCABULARIES_PREDICATE_SET) do |ps|
  ps.source_uri = "https://desmsolutions.org/ns/vocabulary-predicates"
  ps.creator = "DESM Solutions"
end

[{ pref_label: "Related Match", uri: "relatedMatch" },
 { pref_label: "Broad Match", uri: "broadMatch" },
 { pref_label: "Narrow Match", uri: "narrowMatch" },
 { pref_label: "Close Match",  uri: "closeMatch" },
 { pref_label: "Exact Match",  uri: "exactMatch" }].each do |predicate_data|
   Predicate.find_or_create_by!(source_uri: "desm:#{predicate_data[:uri]}", predicate_set:) do |predicate|
     predicate.pref_label = predicate_data[:pref_label]
     predicate.color = Predicate::COLORS[:unset]
     predicate.weight = 0
   end
 end

if predicate_set.strongest_match.nil?
  predicate_set.strongest_match = predicate_set.predicates.find_by(source_uri: "desm:exactMatch")
  predicate_set.save!
end
