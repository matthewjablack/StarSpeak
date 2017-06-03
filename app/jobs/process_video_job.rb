class ProcessVideoJob
  include Sidekiq::Worker

  def perform(video_id)
	video = Video.find(video_id)
    video.upload = URI.parse(video.direct_upload_url)
    video.status = "processed"
    video.save!
  end
end
