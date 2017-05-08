class SpeechstatsController < ApplicationController
	def index
		@speechstats = current_user.speechstats
	end

	def show
		@speechstat = Speechstat.find(params[:id])
	end
end
