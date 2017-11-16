class AddHesitationCountToSpeechStats < ActiveRecord::Migration[5.0]
  def change
    add_column :speech_stats, :hesitation_count, :integer
  end
end
