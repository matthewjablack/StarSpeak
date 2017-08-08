class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception



  def render_flashes
  	flash[:warning] = []
    resource.errors.full_messages.each do |message|
        flash[:warning] << message
    end
  end

  helper_method :render_flashes

end
