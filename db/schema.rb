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

ActiveRecord::Schema.define(version: 2020_10_01_134619) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "assignments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "role_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["role_id"], name: "index_assignments_on_role_id"
    t.index ["user_id"], name: "index_assignments_on_user_id"
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

  create_table "mapping_terms", force: :cascade do |t|
    t.string "uri"
    t.text "comment"
    t.bigint "mapping_id", null: false
    t.integer "predicate_id"
    t.integer "spine_term_id"
    t.integer "mapped_term_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["mapping_id"], name: "index_mapping_terms_on_mapping_id"
    t.index ["predicate_id"], name: "index_mapping_terms_on_predicate_id"
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
    t.index ["specification_id"], name: "index_mappings_on_specification_id"
    t.index ["user_id"], name: "index_mappings_on_user_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "predicates", force: :cascade do |t|
    t.string "pref_label"
    t.text "definition"
    t.string "uri"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uri"], name: "index_predicates_on_uri", unique: true
  end

  create_table "properties", force: :cascade do |t|
    t.string "source_uri"
    t.string "subproperty_of"
    t.string "value_space"
    t.string "label"
    t.text "comment"
    t.jsonb "domain"
    t.string "range"
    t.bigint "term_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "uri"
    t.string "path"
    t.index ["term_id"], name: "index_properties_on_term_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.index ["domain_id"], name: "index_specifications_on_domain_id"
    t.index ["uri"], name: "index_specifications_on_uri", unique: true
    t.index ["user_id"], name: "index_specifications_on_user_id"
  end

  create_table "terms", force: :cascade do |t|
    t.string "name"
    t.string "uri", null: false
    t.bigint "specification_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["specification_id"], name: "index_terms_on_specification_id"
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["organization_id"], name: "users_organization_id"
  end

  create_table "vocabularies", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "organization_id", null: false
    t.jsonb "content", default: "{}", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["organization_id"], name: "index_vocabularies_on_organization_id"
  end

  add_foreign_key "assignments", "roles"
  add_foreign_key "assignments", "users"
  add_foreign_key "domains", "domain_sets"
  add_foreign_key "mapping_terms", "mappings"
  add_foreign_key "mapping_terms", "predicates"
  add_foreign_key "mappings", "specifications"
  add_foreign_key "mappings", "users"
  add_foreign_key "properties", "terms"
  add_foreign_key "specifications", "domains"
  add_foreign_key "specifications", "users"
  add_foreign_key "terms", "specifications"
  add_foreign_key "vocabularies", "organizations"
end
