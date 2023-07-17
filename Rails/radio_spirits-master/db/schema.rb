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

ActiveRecord::Schema.define(version: 2022_10_20_104349) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "access_tokens", force: :cascade do |t|
    t.string "token", null: false
    t.boolean "active", default: true, null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "device_id"
    t.boolean "is_rv_subscribed", default: false
    t.index ["device_id"], name: "index_access_tokens_on_device_id"
  end

  create_table "advertisements", force: :cascade do |t|
    t.string "title"
    t.string "ad_type"
    t.string "redirect_url"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "duration"
    t.integer "image_id"
    t.integer "audio_id"
  end

  create_table "audios", force: :cascade do |t|
    t.string "attachment"
    t.string "audible_type"
    t.bigint "audible_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "duration"
    t.index ["audible_type", "audible_id"], name: "index_audios_on_audible_type_and_audible_id"
  end

  create_table "bookmarks", force: :cascade do |t|
    t.float "seek_time"
    t.bigint "episode_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["episode_id"], name: "index_bookmarks_on_episode_id"
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "copy_texts", force: :cascade do |t|
    t.string "page_name"
    t.string "key"
    t.text "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "devices", force: :cascade do |t|
    t.string "udid"
    t.string "device_name"
    t.string "fcm_token"
    t.string "device_type"
    t.string "device_locale"
    t.string "timezone"
    t.integer "onboarding_bucket_id"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "subscription_bucket_id"
    t.string "reference_id"
  end

  create_table "downloads", force: :cascade do |t|
    t.bigint "episode_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["episode_id"], name: "index_downloads_on_episode_id"
    t.index ["user_id"], name: "index_downloads_on_user_id"
  end

  create_table "email_confirmations", force: :cascade do |t|
    t.integer "device_id"
    t.integer "user_id"
    t.boolean "confirmed", default: false
    t.string "confirmation_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "episodes", force: :cascade do |t|
    t.boolean "paid", default: false
    t.string "title"
    t.text "description"
    t.boolean "available", default: true
    t.integer "stream_count", default: 0
    t.boolean "featured", default: false
    t.float "duration"
    t.date "play_date"
    t.datetime "original_air_date"
    t.bigint "series_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "rscuepisode_id"
    t.integer "audio_id"
    t.integer "image_id"
    t.integer "begin_duration"
    t.integer "end_duration"
    t.datetime "featured_at"
    t.index ["series_id"], name: "index_episodes_on_series_id"
  end

  create_table "genre_series", force: :cascade do |t|
    t.bigint "genre_id"
    t.bigint "series_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["genre_id"], name: "index_genre_series_on_genre_id"
    t.index ["series_id"], name: "index_genre_series_on_series_id"
  end

  create_table "genres", force: :cascade do |t|
    t.string "title"
    t.boolean "available", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "image_id"
  end

  create_table "identities", force: :cascade do |t|
    t.string "provider"
    t.string "uid"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_identities_on_user_id"
  end

  create_table "images", force: :cascade do |t|
    t.string "attachment"
    t.string "imageable_type"
    t.bigint "imageable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["imageable_type", "imageable_id"], name: "index_images_on_imageable_type_and_imageable_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "notification_type"
    t.string "message"
    t.boolean "read", default: false
    t.string "attachment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "onboarding_buckets", force: :cascade do |t|
    t.string "title"
    t.integer "show_signup_after"
    t.integer "skip_signup_for"
    t.boolean "show_signup"
    t.boolean "show_rv_login"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "weight", default: 1, null: false
  end

  create_table "plans", force: :cascade do |t|
    t.string "title"
    t.integer "validity"
    t.float "amount"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "itunes_id"
    t.string "play_store_id"
  end

  create_table "plays", force: :cascade do |t|
    t.integer "user_id"
    t.integer "device_id"
    t.integer "episode_id"
    t.string "rscuepisode_id"
    t.datetime "play_time"
    t.boolean "downloaded"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "recent_streams", force: :cascade do |t|
    t.bigint "episode_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "played_at"
    t.index ["episode_id"], name: "index_recent_streams_on_episode_id"
    t.index ["user_id"], name: "index_recent_streams_on_user_id"
  end

  create_table "series", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.boolean "available", default: true
    t.boolean "featured"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "image_id"
    t.integer "rv_series_id"
    t.datetime "featured_at"
    t.integer "episodes_count", default: 0, null: false
  end

  create_table "settings", force: :cascade do |t|
    t.string "name"
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "subscription_bucket_plans", force: :cascade do |t|
    t.bigint "subscription_bucket_id"
    t.bigint "plan_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_id"], name: "index_subscription_bucket_plans_on_plan_id"
    t.index ["subscription_bucket_id"], name: "index_subscription_bucket_plans_on_subscription_bucket_id"
  end

  create_table "subscription_buckets", force: :cascade do |t|
    t.string "title"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "weight", default: 1, null: false
  end

  create_table "subscriptions", force: :cascade do |t|
    t.string "type"
    t.bigint "plan_id"
    t.bigint "user_id"
    t.date "expiry_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "transaction_identifier"
    t.datetime "transaction_date"
    t.string "platform"
    t.boolean "auto_renewal"
    t.text "transaction_receipt"
    t.index ["plan_id"], name: "index_subscriptions_on_plan_id"
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "subscription_bucket_id"
    t.string "transaction_identifier"
    t.boolean "suspended", default: false
    t.index ["email"], name: "index_users_on_email", unique: true, where: "((email)::text <> NULL::text)"
    t.index ["transaction_identifier"], name: "index_users_on_transaction_identifier"
  end

  create_table "wrw_plays", force: :cascade do |t|
    t.integer "user_id"
    t.integer "device_id"
    t.integer "episode_id"
    t.datetime "play_time"
    t.boolean "downloaded"
    t.boolean "active_paid_user"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "access_tokens", "devices"
  add_foreign_key "bookmarks", "episodes"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "downloads", "episodes"
  add_foreign_key "downloads", "users"
  add_foreign_key "episodes", "series"
  add_foreign_key "genre_series", "genres"
  add_foreign_key "genre_series", "series"
  add_foreign_key "recent_streams", "users"
  add_foreign_key "subscription_bucket_plans", "plans"
  add_foreign_key "subscription_bucket_plans", "subscription_buckets"
  add_foreign_key "subscriptions", "plans"
  add_foreign_key "subscriptions", "users"
end
