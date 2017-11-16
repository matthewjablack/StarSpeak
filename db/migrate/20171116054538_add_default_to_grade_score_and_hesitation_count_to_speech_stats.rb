class AddDefaultToGradeScoreAndHesitationCountToSpeechStats < ActiveRecord::Migration[5.0]
  def up
    change_column :speech_stats, :grade_score, :integer, default: 0
    change_column :speech_stats, :hesitation_count, :integer, default: 0

    SpeechStat.all.each do |speech_stat|
      if speech_stat.hesitation_count.nil?
        speech_stat.update_attributes(hesitation_count: 0)
      end

      if speech_stat.grade_score.nil?
        speech_stat.update_attributes(grade_score: 0)
      end
    end
  end

  def down
    change_column :speech_stats, :grade_score, :integer, default: nil
    change_column :speech_stats, :hesitation_count, :integer, default: nil
  end
end
