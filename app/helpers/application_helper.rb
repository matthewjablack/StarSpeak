module ApplicationHelper

	def get_body_class
		if current_page?(root_path)
			"full_bg"
		end
	end

end
