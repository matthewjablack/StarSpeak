class AddNewPaceToSpeechstats < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :watson_text_pace, :float
    add_column :speechstats, :local_text_pace, :float
  end
end
