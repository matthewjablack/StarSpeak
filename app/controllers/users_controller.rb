class UsersController < ApplicationController
	before_filter :check_admin, only: [:magic_link, :magic_link_show, :create]

  def show
    @user = User.find(params[:id])
  end

  def magic_link
		@user = User.new
  end

  def magic_link_show
		@user = User.find(params[:id])
  end

  def magic_create
		@user = User.new(user_params)
		@user.skip_password_validation = true
		if @user.save
			redirect_to magic_link_show_user_path(@user, token: @user.generate_reset_token)
		else
			redirect_to root_path
		end
  end

  private

  def check_admin
		if !current_user.try(:admin?)
			redirect_to root_path
		end
  end

  def user_params
		params.require(:user).permit(:email, :first_name, :last_name, :betacode_id, :level_id)
	end

end
