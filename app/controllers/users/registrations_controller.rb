class Users::RegistrationsController < Devise::RegistrationsController
  def build_resource(hash=nil)
    hash[:uid] = User.create_unique_string
    super
  end

  before_filter :configure_permitted_parameters

  protected


  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) { |u| u.permit(:email, :password, :password_confirmation, :first_name, :last_name, :level_id, :betacode_id) }
  end


  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation,:first_name, :last_name, :level_id, :betacode_id)
  end


  def after_sign_up_path_for(resource)
    dashboard_path

    
  end

  def after_inactive_sign_up_path_for(resource)
    new_user_session_path
  end
end
