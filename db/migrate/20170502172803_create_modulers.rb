class CreateModulers < ActiveRecord::Migration[5.0]
  def change
    create_table :modulers do |t|
      t.string :name
      t.integer :level_id
      t.integer :order

      t.timestamps
    end
  end
end
