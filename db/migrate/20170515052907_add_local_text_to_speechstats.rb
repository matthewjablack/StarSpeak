class AddLocalTextToSpeechstats < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :local_text, :text
    add_column :speechstats, :pace, :float
  end
end
