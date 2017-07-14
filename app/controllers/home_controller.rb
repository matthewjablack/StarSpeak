class HomeController < ApplicationController

  def index
    if user_signed_in?
			redirect_to level_path(current_user.level)
		end
  end

  def appleby
    if user_signed_in?
			redirect_to level_path(current_user.level)
		end
  end

  def dashboard
  	if !user_signed_in?
			redirect_to root_path
    else
      redirect_to level_path(current_user.level)
		end
  end

end
