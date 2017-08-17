class CreateFacialEmotions < ActiveRecord::Migration[5.0]
  def change
    create_table :facial_emotions do |t|
      t.integer :speechstat_id
      t.integer :facial_id
      t.integer :user_id
      t.integer :frame
      t.float :joy
      t.float :sadness
      t.float :disgust
      t.float :contempt
      t.float :anger
      t.float :fear
      t.float :surprise
      t.float :valance
      t.float :engagement

      t.timestamps
    end
  end
end
