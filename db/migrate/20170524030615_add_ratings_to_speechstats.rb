class AddRatingsToSpeechstats < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :facial_emotions_rating, :integer, :default => 0
    add_column :speechstats, :social_tone_rating, :integer, :default => 0
    add_column :speechstats, :language_tone_rating, :integer, :default => 0
    add_column :speechstats, :emotion_tone_rating, :integer, :default => 0
  end
end
