class PagesController < ApplicationController
	def privacy
	end

	def terms
	end

	def help
	end

	def upload
	end

	def starlight
		@lesson_props = { mode: "StarLight" }
	end

	def render_result_dev

	end
end
