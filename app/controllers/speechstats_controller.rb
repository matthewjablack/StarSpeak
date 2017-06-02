class SpeechstatsController < ApplicationController
	def index
		@speechstats = current_user.speechstats.page(params[:page]).per(10)
	end

	def show
		@speechstat = Speechstat.find(params[:id])
	end

	def update
	end
end
