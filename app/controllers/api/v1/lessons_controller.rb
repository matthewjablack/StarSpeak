class Api::V1::LessonsController < ApplicationController
  skip_before_filter :verify_authenticity_token,
                     :if => Proc.new { |c| c.request.format == 'application/json' }
  before_filter :check_authentication

  # include Serializers::V1::ItemsSerializer

  # Just skip the authentication for now
  # before_filter :authenticate_user!

  # include ActionView::Helpers::TextHelper

  respond_to :json


  def show
    @lesson = Lesson.find(params[:id])
    render :status => 200,
           :json => { :lesson => @lesson, moduler: @lesson.moduler, level: @lesson.level, user: @user, betacode: @user.betacode }
  end

  

  private

    def check_authentication
       if User.where(auth_token: params[:auth_token]).count == 1
        @user = User.where(auth_token: params[:auth_token]).first
       else
        render :status => 401,
               :json => { :success => false,
                          :info => "Authentication failed",
                          :data => {} }
       end

   end



end