class AddGradeScoreToSpeechStats < ActiveRecord::Migration[5.0]
  def change
    add_column :speech_stats, :grade_score, :float
  end
end
