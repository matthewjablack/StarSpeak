class CreateVideo

  attr_reader :current_user, :params, :video

  def initialize(params)
    @params = params
    build
  end

  def call
    saved = @video.save
    if saved
      queue_process
    end
    saved
  end

  private

  def build
    @video = Video.new(@params)
  end

  def queue_process
    ProcessVideoJob.perform_async(@video.id)
  end

end
