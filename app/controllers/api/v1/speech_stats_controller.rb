require 'hash_utils'

class Api::V1::SpeechStatsController < ApplicationController
  skip_before_action :verify_authenticity_token,
                     :if => Proc.new { |c| c.request.format == 'application/json' }
  before_action :check_authentication

  respond_to :json

  def show
    user = User.find(params[:id])
    video_urls = user.speech_stats.map {|x| x.video.nil? ? '' : x.video.direct_upload_url}.select {|x| x != ""}
    render :status => 200, 
             :json => { :success => true,
                        :info => "Success ",
                        :data => {video_urls: video_urls} }
  end

  def create
    speech_stat = SpeechStat.new(speech_stat_params)

    speech_stat_service = SpeechStatService.new(speech_stat: speech_stat, facial_data: facial_data)

    if speech_stat_service.save

      ProcessSpeechStatJob.perform_in(1.second, speech_stat_service.speech_stat.id, 0)

      render :status => 201, 
             :json => { :success => true,
                        :info => "Successfully created speech stat",
                        :data => { speech_stat: speech_stat_service.speech_stat } }
    else
      render :status => 200, 
             :json => { :success => false,
                        :info => "Error: " + speech_stat_service.speech_stat.errors.full_messages,
                        :data => {} }
    end
  end

  def dale_chall
    @dalechall ||= set_list_content(Rails.root.join("config", "dalechall.yml"))

    @common_words ||= set_list_content(Rails.root.join("config", "common_en_words.yml"))

    word_count = params[:text].gsub(/[^-a-z'A-Z]/, ' ').split.size.to_f

    difficult_word_count = (params[:text].gsub(/[^-a-z'A-Z]/, ' ').split - @dalechall).count.to_f

    sentences = word_count / 7

    difficult_ratio = difficult_word_count / word_count

    difficult_weight = difficult_ratio > 0.05 ? 3.6365 : 0

    words = params[:text].gsub(/[^-a-z'A-Z]/, ' ').split #splits the array   

    filtered_words = words
    filtered_words.delete_if {|x| @common_words.include?(x)}

    wf = Hash.new(0).tap { |h| filtered_words.each { |word| h[word] += 1 } } #turns array of words into dictionary hash which makes the frequency

    unique = wf.count #counts the number of unique words

    minute = Float(params[:count] / 60.0)

    wpm = word_count / minute #calculates words per minute

    score = 0.1579 * (difficult_ratio * 100) + 0.0496* (word_count / sentences) + difficult_weight #Final Score calculation for dalechall

    render :status => 200, 
             :json => { :success => true,
                        :info => "Successfully returned score",
                        :data => { score: score,
                                   frequency: wf,
                                   unique_words: unique,
                                   words_per_minute: wpm,
                                   time: params[:count]} }
  end

  def index
    @facial_emotion_stats = FacialEmotionStat.where(speech_stat_id: 281)

    render :status => 200, 
             :json => { :success => true,
                        :info => "Successfully returned score",
                        :data => { facial_emotion_stats: @facial_emotion_stats} }
  end

  private

  def check_authentication
    if User.where(auth_token: params[:auth_token]).count == 1
      @user = User.where(auth_token: params[:auth_token]).first
    end
  end

  def set_list_content(list)
    case list
    when Array then list
    when String, Pathname then YAML.load_file( list.to_s )
    else []
    end
  end

  def speech_stat_params
    params.require(:speech_stat).permit(
      :user_id, 
      :betacode_id, 
      :lesson_id, 
      :moduler_id, 
      :happy_facial_indico, 
      :sad_facial_indico, 
      :angry_facial_indico,
      :fear_facial_indico,
      :surprise_facial_indico,
      :neutral_facial_indico,
      :happy_speech_indico,
      :sad_speech_indico,
      :angry_speech_indico,
      :fear_speech_indico,
      :surprise_speech_indico,
      :agreeableness_indico,
      :conscientiousness_indico,
      :extraversion_indico,
      :openness_indico,
      :watson_text,
      :local_text,
      :watson_text_pace,
      :local_text_pace,
      :browser_name,
      :browser_version,
      :anger_speech_watson,
      :disgust_speech_watson,
      :fear_speech_watson,
      :joy_speech_watson,
      :sadness_speech_watson,
      :analytical_speech_watson,
      :confident_speech_watson,
      :tentative_speech_watson,
      :openness_speech_watson,
      :conscientiousness_speech_watson,
      :extraversion_speech_watson,
      :agreeableness_speech_watson,
      :emotional_range_speech_watson,
      :uuid
    )
  end

  def facial_data
    params[:facial_data][:data]
  end
end