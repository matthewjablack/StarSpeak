class AddFacialEmotionAverageToSpeechStat < ActiveRecord::Migration[5.0]
  def change
    add_column :speech_stats, :facial_emotion_average, :float
  end
end
