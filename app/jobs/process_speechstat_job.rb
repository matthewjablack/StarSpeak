class ProcessSpeechstatJob
  include Sidekiq::Worker

  def perform(speechstat_id)
  	speechstat = Speechstat.find(speechstat_id)
  	if video = Video.where(upload_file_name: speechstat.uuid + ".webm").first
  		speechstat.update_columns(video_id: video.id)
  	else
  		ProcessSpeechstatJob.perform_in(1.second, speechstat_id)
  	end
  end
end
