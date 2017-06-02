class SpeechstatsController < ApplicationController
	def index
		@speechstats = current_user.speechstats.page(params[:page]).per(10)
	end

	def show
		@speechstat = Speechstat.find(params[:id])
	end

	def update
		@speechstat = Speechstat.find(params[:id])
		@speechstat.save
	end
end
