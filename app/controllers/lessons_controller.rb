class LessonsController < ApplicationController
	def index
		@level = Level.find(params[:level_id])
		@moduler = Moduler.find(params[:moduler_id])
		@lessons = @moduler.lessons
	end

	def show
		@level = Level.find(params[:level_id])
		@moduler = Moduler.find(params[:moduler_id])
		@lesson = Lesson.find(params[:id])
		@lesson_props = { lesson: @lesson, moduler: @moduler, level: @level }
	end
end
