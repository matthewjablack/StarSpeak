class CreateFacialAppearanceStats < ActiveRecord::Migration[5.0]
  def change
    create_table :facial_appearance_stats do |t|
      t.integer :speech_stat_id
      t.integer :facial_stat_id
      t.integer :user_id
      t.integer :frame
      t.string :gender
      t.string :glasses
      t.string :age
      t.string :ethnicity

      t.timestamps
    end
  end
end
