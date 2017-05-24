class AddRatingsToSpeechstats < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :facial_emotions_rating, :integer
    add_column :speechstats, :social_tone_rating, :integer
    add_column :speechstats, :language_tone_rating, :integer
    add_column :speechstats, :emotion_tone_rating, :integer
  end
end
