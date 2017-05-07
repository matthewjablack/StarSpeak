class HomeController < ApplicationController

  def index
    if user_signed_in? 
			redirect_to level_path(current_user.level)
		end
  end

  def dashboard
  	if !user_signed_in? 
			redirect_to root_path
		end
  end

end
