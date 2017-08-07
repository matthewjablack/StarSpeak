require 'active_support/core_ext/object/blank'

class Users::RegistrationsController < Devise::RegistrationsController
  def build_resource(hash=nil)
    hash[:uid] = User.create_unique_string
    super
  end

  before_filter :configure_permitted_parameters
  before_filter :validation_and_redirect, only: [:create]

  protected


  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) { |u| u.permit(:email, :password, :password_confirmation, :first_name, :last_name, :level_id, :betacode_id) }
  end

  def validation_and_redirect
    build_resource(sign_up_params)

    if resource.invalid? && !resource.betacode_id.nil?
      betacode = Betacode.find(resource.betacode_id)
      redirect_to new_user_registration_path(beta_code: betacode.token)
      resource.errors.full_messages.each do |message|
        flash[:warning] = message
      end
    end

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
