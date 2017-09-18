class SpeechStatsController < ApplicationController
	def index
		@speech_stats = current_user.speech_stats.where("local_text_pace > 5").page(params[:page]).per(15)

    @speech_stat_dashboard_props = { paces: serialize_speech_stats_pace(@speech_stats) }
	end

	def show
		@speech_stat = SpeechStat.find(params[:id])
	end

  private

  def serialize_speech_stats_pace(speech_stats)
    speech_stats.map do |speech_stat|
      {
        pace: speech_stat.local_text_pace.round
      }
    end
  end
end
