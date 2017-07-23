require 'test_helper'

class SpeechstatsIntegrationTest < ActionDispatch::IntegrationTest
	setup do 
		@speechstat = speechstats(:main)
		@speechstat_data = {
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
		post api_v1_speechstats_path, as: :json, params: {speechstat: @speechstat_data}

		response_speechstat = JSON.parse(response.body)['data']['speechstat']

		assert_response :created

		assert_equal response_speechstat['user_id'], @speechstat_data[:user_id]
		assert_equal response_speechstat['betacode_id'], @speechstat_data[:betacode_id]
		assert_equal response_speechstat['lesson_id'], @speechstat_data[:lesson_id]
		assert_equal response_speechstat['moduler_id'], @speechstat_data[:moduler_id]
		assert_equal response_speechstat['happy_facial_indico'], @speechstat_data[:happy_facial_indico]
	end
end