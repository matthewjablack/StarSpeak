class CreateLessons < ActiveRecord::Migration[5.0]
  def change
    create_table :lessons do |t|
      t.string :name
      t.integer :level_id
      t.integer :order
      t.integer :moduler_id

      t.timestamps
    end
  end
end
