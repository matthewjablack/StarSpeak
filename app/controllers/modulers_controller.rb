class ModulersController < ApplicationController
	def index
		@level = Level.find(params[:level_id])
		@modulers = @level.modulers
	end



end
