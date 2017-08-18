class RemoveOriginalFacial < ActiveRecord::Migration[5.0]
  def change
    drop_table :facials
    drop_table :facial_appearances
    drop_table :facial_emotions
    drop_table :facial_expressions
    drop_table :facial_emojis
  end
end
