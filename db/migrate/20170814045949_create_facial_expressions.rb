class CreateFacialExpressions < ActiveRecord::Migration[5.0]
  def change
    create_table :facial_expressions do |t|
      t.integer :speechstat_id
      t.integer :facial_id
      t.integer :user_id
      t.integer :frame
      t.float :smile
      t.float :inner_brow_raise
      t.float :brow_raise
      t.float :brow_furrow
      t.float :nose_wrinkle
      t.float :upper_lip_raise
      t.float :lip_corner_depressor
      t.float :chin_raise
      t.float :lip_pucker
      t.float :lip_press
      t.float :lip_suck
      t.float :mouth_open
      t.float :smirk
      t.float :eye_closure
      t.float :attention
      t.float :lid_tighten
      t.float :jaw_drop
      t.float :simpler
      t.float :eye_widen
      t.float :cheek_raise
      t.float :lip_stretch

      t.timestamps
    end
  end
end
