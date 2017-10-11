class AddWordChoiceComplexityToSpeechStats < ActiveRecord::Migration[5.0]
  def change
    add_column :speech_stats, :word_choice_complexity, :float
  end
end
