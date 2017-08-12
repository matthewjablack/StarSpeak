module ApplicationHelper

	def get_body_class
		if current_page?(root_path)
			"full_bg"
		elsif (params[:controller] == "lessons" && params[:action] == "show") || params[:controller] == "hello_world"
			"view"
		else
			""
		end
	end

	def get_body_class()
		if params[:controller] == "home" && params[:action] == "index"
			"startup-home"
		else
			"main"
		end
	end
	
	def is_home_page?
		params[:controller] == "home" && params[:action] == "index"
	end
end

