class Api::V1::UploadsController < ApplicationController

  def create
    @generate_upload_url_service = GenerateUploadUrl.new(create_params[:filename])
    @generate_upload_url_service.call
    render :status => 200,
           :json => { upload: {content_type: @generate_upload_url_service.content_type,
						   url: @generate_upload_url_service.url} }
  end

  private

  def create_params
    params.require(:upload).permit(:filename)
  end

end
