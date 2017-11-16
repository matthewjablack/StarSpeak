class AddWordFrequencyToSpeechStats < ActiveRecord::Migration[5.0]
  def change
    add_column :speech_stats, :word_frequency, :text
  end
end
