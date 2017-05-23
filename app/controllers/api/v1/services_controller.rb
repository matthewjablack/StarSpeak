class Api::V1::ServicesController < ApplicationController
  skip_before_filter :verify_authenticity_token,
                     :if => Proc.new { |c| c.request.format == 'application/json' }
  before_filter :check_authentication

  include HTTParty

  # include Serializers::V1::ItemsSerializer

  # Just skip the authentication for now
  # before_filter :authenticate_user!

  # include ActionView::Helpers::TextHelper

  respond_to :json


  def watson_tone
    username = ENV['watson_tone_username']
    password = ENV['watson_tone_password']
    @result = HTTParty.post("https://" + username + ':' + password + "@gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19",
    body: {text: params[:text]}.to_json,
    headers: { 'Content-Type' => 'application/json' } )

    render :status => 200,
           :json => { result: @result }

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