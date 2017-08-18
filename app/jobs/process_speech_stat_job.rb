class ProcessSpeechStatJob
  include Sidekiq::Worker

  def perform(speech_stat_id, count)
  	speech_stat = SpeechStat.find(speech_stat_id)
  	if video = Video.where(upload_file_name: speech_stat.uuid + ".webm").first
  		speech_stat.update_columns(video_id: video.id)
  	elsif count < 30
  		ProcessSpeechStatJob.perform_in(1.second, speech_stat_id, count + 1)
  	end
  end
end
