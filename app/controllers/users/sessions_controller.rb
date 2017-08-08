class Users::SessionsController < Devise::SessionsController

	before_filter :validation_and_redirect, only: [:create]


	protected 

	def validation_and_redirect
		build_resource(sign_in_params_new)
		if resource.invalid?
			redirect_to new_user_session_path
			render_flashes
		end
	end

	def sign_in_params_new
		params.require(:user).permit(:email, :password)
	end

	def build_resource(hash=nil)
		self.resource = resource_class.new_with_session(hash || {}, session)
	end

end
