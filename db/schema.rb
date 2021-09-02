# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_08_21_011708) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "alignment_mapped_terms", force: :cascade do |t|
    t.bigint "alignment_id"
    t.bigint "term_id"
    t.index ["alignment_id", "term_id"], name: "index_alignment_mapped_terms_on_alignment_id_and_term_id", unique: true
    t.index ["alignment_id"], name: "index_alignment_mapped_terms_on_alignment_id"
    t.index ["term_id"], name: "index_alignment_mapped_terms_on_term_id"
  end

  create_table "alignment_vocabularies", force: :cascade do |t|
    t.bigint "alignment_id", null: false
    t.string "title"
    t.string "description"
    t.string "creator"
    t.index ["alignment_id"], name: "index_alignment_vocabularies_on_alignment_id"
  end

  create_table "alignment_vocabulary_concept_mapped_concepts", force: :cascade do |t|
    t.bigint "alignment_vocabulary_concept_id", null: false
    t.bigint "skos_concept_id", null: false
    t.index ["alignment_vocabulary_concept_id", "skos_concept_id"], name: "index_avcmc_alignment_vocabulary_concept_id_skos_concept_id", unique: true
    t.index ["alignment_vocabulary_concept_id"], name: "index_avc_mapped_concepts_acv_id"
    t.index ["skos_concept_id"], name: "index_avc_mapped_concepts_skos_concept_id"
  end

  create_table "alignment_vocabulary_concepts", force: :cascade do |t|
    t.bigint "alignment_vocabulary_id", null: false
    t.bigint "predicate_id"
    t.integer "spine_concept_id", null: false
    t.index ["alignment_vocabulary_id"], name: "index_alignment_vocabulary_concepts_on_alignment_vocabulary_id"
    t.index ["predicate_id"], name: "index_alignment_vocabulary_concepts_on_predicate_id"
  end

  create_table "alignments", force: :cascade do |t|
    t.string "uri"
    t.text "comment"
    t.bigint "mapping_id", null: false
    t.bigint "predicate_id"
    t.integer "spine_term_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "vocabulary_id"
    t.boolean "synthetic", default: false, null: false
    t.index ["mapping_id"], name: "index_alignments_on_mapping_id"
    t.index ["predicate_id"], name: "index_alignments_on_predicate_id"
    t.index ["vocabulary_id"], name: "index_alignments_on_vocabulary_id"
  end

  create_table "assignments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "role_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["role_id"], name: "index_assignments_on_role_id"
    t.index ["user_id"], name: "index_assignments_on_user_id"
  end

  create_table "audits", force: :cascade do |t|
    t.integer "auditable_id"
    t.string "auditable_type"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.string "action"
    t.text "audited_changes"
    t.integer "version", default: 0
    t.string "comment"
    t.string "remote_address"
    t.string "request_uuid"
    t.datetime "created_at"
    t.index ["associated_type", "associated_id"], name: "associated_index"
    t.index ["auditable_type", "auditable_id", "version"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "configuration_profiles", force: :cascade do |t|
    t.text "description"
    t.string "name"
    t.jsonb "structure"
    t.integer "state", default: 0, null: false
    t.bigint "domain_set_id"
    t.bigint "predicate_set_id"
    t.bigint "administrator_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["administrator_id"], name: "index_configuration_profiles_on_administrator_id"
    t.index ["domain_set_id"], name: "index_configuration_profiles_on_domain_set_id"
    t.index ["predicate_set_id"], name: "index_configuration_profiles_on_predicate_set_id"
  end

  create_table "domain_sets", force: :cascade do |t|
    t.string "title", null: false
    t.string "uri", null: false
    t.text "description"
    t.string "creator"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uri"], name: "index_domain_sets_on_uri", unique: true
  end

  create_table "domains", force: :cascade do |t|
    t.string "pref_label", null: false
    t.string "uri", null: false
    t.text "definition"
    t.bigint "domain_set_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "spine_id"
    t.index ["domain_set_id"], name: "index_domains_on_domain_set_id"
    t.index ["uri"], name: "index_domains_on_uri", unique: true
  end

  create_table "mapping_selected_terms", force: :cascade do |t|
    t.bigint "mapping_id"
    t.bigint "term_id"
    t.index ["mapping_id", "term_id"], name: "index_mapping_selected_terms_on_mapping_id_and_term_id", unique: true
    t.index ["mapping_id"], name: "index_mapping_selected_terms_on_mapping_id"
    t.index ["term_id"], name: "index_mapping_selected_terms_on_term_id"
  end

  create_table "mappings", force: :cascade do |t|
    t.string "name"
    t.string "title"
    t.text "description"
    t.bigint "user_id", null: false
    t.bigint "specification_id", null: false
    t.integer "spine_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.index ["specification_id"], name: "index_mappings_on_specification_id"
    t.index ["user_id"], name: "index_mappings_on_user_id"
  end

  create_table "merged_files", force: :cascade do |t|
    t.jsonb "content", default: "{}", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "email", null: false
    t.bigint "configuration_profile_id", null: false
    t.bigint "administrator_id"
    t.text "description"
    t.string "homepage_url"
    t.string "standards_page"
    t.index ["administrator_id"], name: "index_organizations_on_administrator_id"
    t.index ["configuration_profile_id"], name: "index_organizations_on_configuration_profile_id"
  end

  create_table "predicate_sets", force: :cascade do |t|
    t.string "title", null: false
    t.string "uri", null: false
    t.text "description"
    t.string "creator"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uri"], name: "index_predicate_sets_on_uri", unique: true
  end

  create_table "predicates", force: :cascade do |t|
    t.string "pref_label"
    t.text "definition"
    t.string "uri"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "weight", default: 0.0, null: false
    t.string "color"
    t.integer "predicate_set_id"
    t.index ["uri"], name: "index_predicates_on_uri", unique: true
  end

  create_table "properties", force: :cascade do |t|
    t.string "source_uri"
    t.string "subproperty_of"
    t.string "value_space"
    t.string "label"
    t.text "comment"
    t.jsonb "domain"
    t.jsonb "range"
    t.bigint "term_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "uri"
    t.string "path"
    t.string "selected_domain"
    t.string "selected_range"
    t.string "scheme"
    t.index ["term_id"], name: "index_properties_on_term_id"
  end

  create_table "rdfs_class_nodes", force: :cascade do |t|
    t.string "uri"
    t.jsonb "definition"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uri"], name: "index_rdfs_class_nodes_on_uri", unique: true
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "skos_concepts", force: :cascade do |t|
    t.jsonb "raw", null: false
    t.string "uri", null: false
    t.index ["uri"], name: "index_skos_concepts_on_uri", unique: true
  end

  create_table "skos_concepts_vocabularies", id: false, force: :cascade do |t|
    t.bigint "skos_concept_id", null: false
    t.bigint "vocabulary_id", null: false
    t.index ["skos_concept_id", "vocabulary_id"], name: "index_skos_concepts_vocab_on_skos_concept_id_and_vocabulary_id", unique: true
  end

  create_table "specifications", force: :cascade do |t|
    t.string "name", null: false
    t.string "uri", null: false
    t.string "version"
    t.string "use_case"
    t.bigint "user_id", null: false
    t.bigint "domain_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "selected_domains_from_file"
    t.index ["domain_id"], name: "index_specifications_on_domain_id"
    t.index ["uri"], name: "index_specifications_on_uri", unique: true
    t.index ["user_id"], name: "index_specifications_on_user_id"
  end

  create_table "specifications_terms", id: false, force: :cascade do |t|
    t.bigint "specification_id", null: false
    t.bigint "term_id", null: false
    t.index ["specification_id", "term_id"], name: "index_specifications_terms_on_specification_id_and_term_id", unique: true
  end

  create_table "terms", force: :cascade do |t|
    t.string "name"
    t.string "uri", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "organization_id"
    t.index ["organization_id"], name: "index_terms_on_organization_id"
  end

  create_table "terms_vocabularies", id: false, force: :cascade do |t|
    t.bigint "term_id", null: false
    t.bigint "vocabulary_id", null: false
    t.index ["term_id", "vocabulary_id"], name: "index_terms_vocabularies_on_term_id_and_vocabulary_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "fullname", null: false
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "organization_id"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.string "phone"
    t.string "github_handle"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "vocabularies", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "organization_id", null: false
    t.jsonb "content", default: "{}", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "context", default: {}, null: false
    t.index ["organization_id"], name: "index_vocabularies_on_organization_id"
  end

  add_foreign_key "alignment_mapped_terms", "alignments"
  add_foreign_key "alignment_mapped_terms", "terms"
  add_foreign_key "alignment_vocabularies", "alignments"
  add_foreign_key "alignment_vocabulary_concept_mapped_concepts", "alignment_vocabulary_concepts"
  add_foreign_key "alignment_vocabulary_concept_mapped_concepts", "skos_concepts"
  add_foreign_key "alignment_vocabulary_concepts", "alignment_vocabularies"
  add_foreign_key "alignment_vocabulary_concepts", "predicates"
  add_foreign_key "alignments", "mappings"
  add_foreign_key "alignments", "predicates"
  add_foreign_key "alignments", "vocabularies"
  add_foreign_key "assignments", "roles"
  add_foreign_key "assignments", "users"
  add_foreign_key "configuration_profiles", "domain_sets"
  add_foreign_key "configuration_profiles", "predicate_sets"
  add_foreign_key "configuration_profiles", "users", column: "administrator_id"
  add_foreign_key "domains", "domain_sets"
  add_foreign_key "mapping_selected_terms", "mappings"
  add_foreign_key "mapping_selected_terms", "terms"
  add_foreign_key "mappings", "specifications"
  add_foreign_key "mappings", "users"
  add_foreign_key "organizations", "configuration_profiles"
  add_foreign_key "organizations", "users", column: "administrator_id"
  add_foreign_key "properties", "terms"
  add_foreign_key "specifications", "domains"
  add_foreign_key "specifications", "users"
  add_foreign_key "terms", "organizations"
  add_foreign_key "vocabularies", "organizations"
end
