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

ActiveRecord::Schema.define(version: 20170906040417) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_type"
    t.integer  "resource_id"
    t.string   "author_type"
    t.integer  "author_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree
  end

  create_table "betacodes", force: :cascade do |t|
    t.string   "name"
    t.string   "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "facial_appearance_stats", force: :cascade do |t|
    t.integer  "speech_stat_id"
    t.integer  "facial_stat_id"
    t.integer  "user_id"
    t.integer  "frame"
    t.string   "gender"
    t.string   "glasses"
    t.string   "age"
    t.string   "ethnicity"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "facial_emoji_stats", force: :cascade do |t|
    t.integer  "speech_stat_id"
    t.integer  "facial_stat_id"
    t.integer  "user_id"
    t.integer  "frame"
    t.float    "relaxed"
    t.float    "smiley"
    t.float    "laughing"
    t.float    "kissing"
    t.float    "disappointed"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "facial_emotion_stats", force: :cascade do |t|
    t.integer  "speech_stat_id"
    t.integer  "facial_stat_id"
    t.integer  "user_id"
    t.integer  "frame"
    t.float    "joy"
    t.float    "sadness"
    t.float    "disgust"
    t.float    "contempt"
    t.float    "anger"
    t.float    "fear"
    t.float    "surprise"
    t.float    "valance"
    t.float    "engagement"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "facial_expression_stats", force: :cascade do |t|
    t.integer  "speech_stat_id"
    t.integer  "facial_stat_id"
    t.integer  "user_id"
    t.integer  "frame"
    t.float    "smile"
    t.float    "inner_brow_raise"
    t.float    "brow_raise"
    t.float    "brow_furrow"
    t.float    "nose_wrinkle"
    t.float    "upper_lip_raise"
    t.float    "lip_corner_depressor"
    t.float    "chin_raise"
    t.float    "lip_pucker"
    t.float    "lip_press"
    t.float    "lip_suck"
    t.float    "mouth_open"
    t.float    "smirk"
    t.float    "eye_closure"
    t.float    "attention"
    t.float    "lid_tighten"
    t.float    "jaw_drop"
    t.float    "simpler"
    t.float    "eye_widen"
    t.float    "cheek_raise"
    t.float    "lip_stretch"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  create_table "facial_stats", force: :cascade do |t|
    t.integer  "speech_stat_id"
    t.integer  "user_id"
    t.integer  "face_count"
    t.integer  "frame"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "group_memberships", force: :cascade do |t|
    t.integer  "group_id"
    t.integer  "user_id"
    t.boolean  "admin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "groups", force: :cascade do |t|
    t.string   "name"
    t.string   "url"
    t.integer  "organization_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "images", force: :cascade do |t|
    t.string   "image"
    t.integer  "speechstat_id"
    t.integer  "user_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "ip_sessions", force: :cascade do |t|
    t.string   "ip"
    t.integer  "count",      default: 0
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "lessons", force: :cascade do |t|
    t.string   "name"
    t.integer  "level_id"
    t.integer  "moduler_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "sort_order"
    t.text     "content"
    t.integer  "length"
    t.integer  "prep"
  end

  create_table "levels", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "modulers", force: :cascade do |t|
    t.string   "name"
    t.integer  "level_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "sort_order"
  end

  create_table "organization_memberships", force: :cascade do |t|
    t.integer  "organization_id"
    t.integer  "user_id"
    t.boolean  "admin"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.string   "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "speech_stats", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "betacode_id"
    t.integer  "lesson_id"
    t.integer  "moduler_id"
    t.float    "happy_facial_indico"
    t.float    "sad_facial_indico"
    t.float    "angry_facial_indico"
    t.float    "fear_facial_indico"
    t.float    "surprise_facial_indico"
    t.float    "neutral_facial_indico"
    t.float    "happy_speech_indico"
    t.float    "sad_speech_indico"
    t.float    "angry_speech_indico"
    t.float    "fear_speech_indico"
    t.float    "surprise_speech_indico"
    t.float    "agreeableness_indico"
    t.float    "conscientiousness_indico"
    t.float    "extraversion_indico"
    t.float    "openness_indico"
    t.text     "watson_text"
    t.text     "local_text"
    t.string   "browser_name"
    t.string   "browser_version"
    t.float    "watson_text_pace"
    t.float    "local_text_pace"
    t.float    "anger_speech_watson"
    t.float    "disgust_speech_watson"
    t.float    "fear_speech_watson"
    t.float    "joy_speech_watson"
    t.float    "sadness_speech_watson"
    t.float    "analytical_speech_watson"
    t.float    "confident_speech_watson"
    t.float    "tentative_speech_watson"
    t.float    "openness_speech_watson"
    t.float    "conscientiousness_speech_watson"
    t.float    "extraversion_speech_watson"
    t.float    "agreeableness_speech_watson"
    t.float    "emotional_range_speech_watson"
    t.integer  "facial_emotions_rating"
    t.integer  "social_tone_rating"
    t.integer  "language_tone_rating"
    t.integer  "emotion_tone_rating"
    t.string   "video_file_name"
    t.string   "video_content_type"
    t.integer  "video_file_size"
    t.datetime "video_updated_at"
    t.integer  "video_id"
    t.string   "uuid"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.integer  "level_id"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "auth_token"
    t.integer  "betacode_id"
    t.boolean  "admin",                  default: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true, using: :btree
  end

  create_table "videos", force: :cascade do |t|
    t.string   "direct_upload_url",               null: false
    t.string   "upload_file_name"
    t.string   "upload_content_type"
    t.integer  "upload_file_size"
    t.datetime "upload_updated_at"
    t.integer  "status",              default: 0, null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["status"], name: "index_videos_on_status", using: :btree
  end

end
