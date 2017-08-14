class CreateFacialAppearances < ActiveRecord::Migration[5.0]
  def change
    create_table :facial_appearances do |t|
      t.integer :speechstat_id
      t.integer :facial_id
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
