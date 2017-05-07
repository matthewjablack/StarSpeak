class AddWatsonTextToSpeechstats < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :watson_text, :text
  end
end
