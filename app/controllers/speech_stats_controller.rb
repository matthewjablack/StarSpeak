class SpeechStatsController < ApplicationController
	def index
		@speech_stats = current_user.speech_stats.page(params[:page]).per(10)
	end

	def show
		@speech_stat = SpeechStat.find(params[:id])
	end
end
