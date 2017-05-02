class LevelsController < ApplicationController
	def index
		@levels = Level.all
	end

	def show
		@level = Level.find(params[:id])
		@modulers = @level.modulers
	end


end
