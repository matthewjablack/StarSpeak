class CreateFacialEmojiStats < ActiveRecord::Migration[5.0]
  def change
    create_table :facial_emoji_stats do |t|
      t.integer :speech_stat_id
      t.integer :facial_stat_id
      t.integer :user_id
      t.integer :frame
      t.float :relaxed
      t.float :smiley
      t.float :laughing
      t.float :kissing
      t.float :disappointed

      t.timestamps
    end
  end
end
