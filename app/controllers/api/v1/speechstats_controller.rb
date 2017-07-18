class Api::V1::SpeechstatsController < ApplicationController
  skip_before_filter :verify_authenticity_token,
                     :if => Proc.new { |c| c.request.format == 'application/json' }
  before_filter :check_authentication

  respond_to :json


  def create
    @speechstat = Speechstat.new(
      user_id: params[:user_id], 
      betacode_id: params[:betacode_id], 
      lesson_id: params[:lesson_id], 
      moduler_id: params[:moduler_id], 
      happy_facial_indico: params[:happy_facial_indico], 
      sad_facial_indico: params[:sad_facial_indico],
      angry_facial_indico: params[:angry_facial_indico],
      fear_facial_indico: params[:fear_facial_indico],
      surprise_facial_indico: params[:surprise_facial_indico],
      neutral_facial_indico: params[:neutral_facial_indico],
      happy_speech_indico: params[:happy_speech_indico],
      sad_speech_indico: params[:sad_speech_indico],
      angry_speech_indico: params[:angry_speech_indico],
      fear_speech_indico: params[:fear_speech_indico],
      surprise_speech_indico: params[:surprise_speech_indico],
      agreeableness_indico: params[:agreeableness_indico],
      conscientiousness_indico: params[:conscientiousness_indico],
      extraversion_indico: params[:extraversion_indico],
      openness_indico: params[:openness_indico],
      watson_text: params[:watson_text],
      local_text: params[:local_text],
      watson_text_pace: params[:watson_text_pace],
      local_text_pace: params[:local_text_pace],
      browser_name: params[:browser_name],
      browser_version: params[:browser_version],
      anger_speech_watson: params[:anger_speech_watson],
      disgust_speech_watson: params[:disgust_speech_watson], 
      fear_speech_watson: params[:fear_speech_watson],
      joy_speech_watson: params[:joy_speech_watson],
      sadness_speech_watson: params[:sadness_speech_watson],
      analytical_speech_watson: params[:analytical_speech_watson],
      confident_speech_watson: params[:confident_speech_watson],
      tentative_speech_watson: params[:tentative_speech_watson],
      openness_speech_watson: params[:openness_speech_watson],
      conscientiousness_speech_watson: params[:conscientiousness_speech_watson],
      extraversion_speech_watson: params[:extraversion_speech_watson],
      agreeableness_speech_watson: params[:agreeableness_speech_watson], 
      emotional_range_speech_watson: params[:emotional_range_speech_watson],
      uuid: params[:uuid]
    )

    if @speechstat.save

      ProcessSpeechstatJob.perform_in(1.second, @speechstat.id, 0)

      render :status => 200, 
             :json => { :success => true,
                        :info => "Successfully created speechstat",
                        :data => { speechstat: @speechstat } }
    else
      render :status => 200, 
             :json => { :success => false,
                        :info => "Error: " + @speechstat.errors.full_messages,
                        :data => {} }
    end
  end

  def dale_chall
    @dalechall ||= set_list_content(Rails.root.join("config", "dalechall.yml"))

    word_count = params[:text].gsub(/[^-a-z'A-Z]/, ' ').split.size.to_f

    difficult_word_count = (params[:text].gsub(/[^-a-z'A-Z]/, ' ').split - @dalechall).count.to_f

    sentences = word_count / 7

    difficult_ratio = difficult_word_count / word_count

    difficult_weight = difficult_ratio > 0.05 ? 3.6365 : 0

    words = params[:text].gsub(/[^-a-z'A-Z]/, ' ').split #splits the 

    wf = Hash.new(0).tap { |h| words.each { |word| h[word] += 1 } } #turns array of words into dictionary hash which makes the frequency

    score = 0.1579 * (difficult_ratio * 100) + 0.0496* (word_count / sentences) + difficult_weight

    unique = wf.count #counts the number of unique words

    render :status => 200, 
             :json => { :success => true,
                        :info => "Successfully returned score",
                        :data => {score: score,
                                  keyword_density: wf,
                                  unique_words: unique,
                                  time: params[:count]} }
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
end