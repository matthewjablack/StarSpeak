class Api::V1::IpSessionsController < ApplicationController
  skip_before_filter :verify_authenticity_token,
                     :if => Proc.new { |c| c.request.format == 'application/json' }
  before_filter :find_ip_session

  # include Serializers::V1::ItemsSerializer

  # Just skip the authentication for now
  # before_filter :authenticate_user!

  # include ActionView::Helpers::TextHelper

  respond_to :json


  def create
    @ip_session.update_attributes(count: @ip_session.count + 1)
    if @ip_session.count < 3
      render :status => 200, 
             :json => { :success => true,
                        :info => "Success",
                        :data => {} }
    else 
      render :status => 200, 
             :json => { :success => false,
                        :info => "Exceeded demo limit",
                        :data => {} }
    end
    
  end

  

  private

  def find_ip_session
    @ip_session = IpSession.find_or_create_by(ip: request.ip)
  end



end