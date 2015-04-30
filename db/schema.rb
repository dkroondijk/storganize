# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150430014003) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "boxes", force: :cascade do |t|
    t.string   "name"
    t.integer  "cube_id"
    t.integer  "x"
    t.integer  "y"
    t.integer  "z"
    t.integer  "locker_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "boxes", ["locker_id"], name: "index_boxes_on_locker_id", using: :btree

  create_table "items", force: :cascade do |t|
    t.string   "name"
    t.integer  "box_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "items", ["box_id"], name: "index_items_on_box_id", using: :btree

  create_table "lockers", force: :cascade do |t|
    t.string   "name"
    t.integer  "length"
    t.integer  "width"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "lockers", ["user_id"], name: "index_lockers_on_user_id", using: :btree

  create_table "members", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "locker_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "members", ["locker_id"], name: "index_members_on_locker_id", using: :btree
  add_index "members", ["user_id"], name: "index_members_on_user_id", using: :btree

  create_table "taggings", force: :cascade do |t|
    t.integer  "box_id"
    t.integer  "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "taggings", ["box_id"], name: "index_taggings_on_box_id", using: :btree
  add_index "taggings", ["tag_id"], name: "index_taggings_on_tag_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "password_digest"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_foreign_key "boxes", "lockers"
  add_foreign_key "items", "boxes"
  add_foreign_key "lockers", "users"
  add_foreign_key "members", "lockers"
  add_foreign_key "members", "users"
  add_foreign_key "taggings", "boxes"
  add_foreign_key "taggings", "tags"
end
