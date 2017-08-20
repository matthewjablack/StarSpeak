require 'test_helper'

class SpeechStatsIntegrationTest < ActionDispatch::IntegrationTest
	setup do 
		@speech_stat = speech_stats(:main)
		@speech_stat_data = {
			user_id: 1,
		  betacode_id: 1,
		  lesson_id: 1,
		  moduler_id: 1,
		  happy_facial_indico: 1.5,
		  sad_facial_indico: 1.5,
		  angry_facial_indico: 1.5,
		  fear_facial_indico: 1.5,
		  surprise_facial_indico: 1.5,
		  neutral_facial_indico: 1.5
		}
	end

	test '#create succeeds with new speechstat' do 
		post api_v1_speech_stats_path, as: :json, params: {
			speech_stat: @speech_stat_data,
			facial_data: { data: [{faces: 1, appearances: nil, emotions: nil, expressions: nil, emojis: nil}] }
		}

		response_speech_stat = JSON.parse(response.body)['data']['speech_stat']

		assert_response :created

		assert_equal response_speech_stat['user_id'], @speech_stat_data[:user_id]
		assert_equal response_speech_stat['betacode_id'], @speech_stat_data[:betacode_id]
		assert_equal response_speech_stat['lesson_id'], @speech_stat_data[:lesson_id]
		assert_equal response_speech_stat['moduler_id'], @speech_stat_data[:moduler_id]
		assert_equal response_speech_stat['happy_facial_indico'], @speech_stat_data[:happy_facial_indico]
	end
end