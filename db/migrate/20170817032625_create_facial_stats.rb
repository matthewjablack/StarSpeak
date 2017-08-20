class CreateFacialStats < ActiveRecord::Migration[5.0]
  def change
    create_table :facial_stats do |t|
      t.integer :speech_stat_id
      t.integer :user_id
      t.integer :face_count
      t.integer :frame
      t.integer :facial_appearance_stat_id
      t.integer :facial_emotion_stat_id
      t.integer :facial_expression_stat_id
      t.integer :facial_emoji_stat_id

      t.timestamps
    end
  end
end
