class Api::V1::VideosController < ApplicationController

  def index
    @videos = Video.all
    render :status => 200,
           :json => {videos: serialize_videos(@videos)}
  end

  def create
    @create_video_service = CreateVideo.new(video_params)
    @video = @create_video_service.video
    if @create_video_service.call
      render :status => 200,
            :json => { video: @video }
    else
      render json: { errors: @video.errors.messages }, status: :unprocessable_entity
    end
  end

  def update
    @video = Video.find(params[:id])
    if @video.update_attributes(video_id: params[:video_id])
      render :status => 200,
               :json => { :success => true,
                          :info => "Updated video attributes",
                          :data => {video: @video} } 
    else
      render :status => 401,
               :json => { :success => false,
                          :info => "Error updating video attributes",
                          :data => {} } 
    end
  end

  private

  def video_params
    params.require(:video).permit(:direct_upload_url, :upload_content_type, :upload_file_name, :upload_file_size)
  end

  def serialize_videos(videos)
      videos.map do |video|
          {
            id: video.id, 
            upload_file_name: video.upload_file_name,
            upload_content_type: video.upload_content_type,
            upload_file_size: video.upload_file_size,
            status: video.status,
            created_at: video.created_at,
            url: video.direct_upload_url,
          }
        end
    end

end
