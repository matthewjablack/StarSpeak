class AddWatsonAttributesToSpeechstats < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :anger_speech_watson, :float
    add_column :speechstats, :disgust_speech_watson, :float
    add_column :speechstats, :fear_speech_watson, :float
    add_column :speechstats, :joy_speech_watson, :float
    add_column :speechstats, :sadness_speech_watson, :float
    add_column :speechstats, :analytical_speech_watson, :float
    add_column :speechstats, :confident_speech_watson, :float
    add_column :speechstats, :tentative_speech_watson, :float
    add_column :speechstats, :openness_speech_watson, :float
    add_column :speechstats, :conscientiousness_speech_watson, :float
    add_column :speechstats, :extraversion_speech_watson, :float
    add_column :speechstats, :agreeableness_speech_watson, :float
    add_column :speechstats, :emotional_range_speech_watson, :float
  end
end
