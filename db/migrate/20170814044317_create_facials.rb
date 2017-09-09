class CreateFacials < ActiveRecord::Migration[5.0]
  def change
    create_table :facials do |t|
      t.integer :speechstat_id
      t.integer :user_id
      t.integer :face_count
      t.integer :frame
      t.integer :facial_appearance_id
      t.integer :facial_emotion_id
      t.integer :facial_expression_id
      t.integer :facial_emoji_id

      t.timestamps
    end
  end
end
