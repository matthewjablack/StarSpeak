class AddWatsonHesitationsToSpeechStats < ActiveRecord::Migration[5.0]
  def change
    add_column :speech_stats, :watson_hesitations, :integer
  end
end
