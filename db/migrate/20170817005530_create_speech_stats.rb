class CreateSpeechStats < ActiveRecord::Migration[5.0]
  def change
    create_table :speech_stats do |t|
      t.integer :user_id
      t.integer :betacode_id
      t.integer :lesson_id
      t.integer :moduler_id
      t.float :happy_facial_indico
      t.float :sad_facial_indico
      t.float :angry_facial_indico
      t.float :fear_facial_indico
      t.float :surprise_facial_indico
      t.float :neutral_facial_indico
      t.float :happy_speech_indico
      t.float :sad_speech_indico
      t.float :angry_speech_indico
      t.float :fear_speech_indico
      t.float :surprise_speech_indico
      t.float :agreeableness_indico
      t.float :conscientiousness_indico
      t.float :extraversion_indico
      t.float :openness_indico
      t.text :watson_text
      t.text :local_text
      t.string :browser_name
      t.string :browser_version
      t.float :watson_text_pace
      t.float :local_text_pace
      t.float :anger_speech_watson
      t.float :disgust_speech_watson
      t.float :fear_speech_watson
      t.float :joy_speech_watson
      t.float :sadness_speech_watson
      t.float :analytical_speech_watson
      t.float :confident_speech_watson
      t.float :tentative_speech_watson
      t.float :openness_speech_watson
      t.float :conscientiousness_speech_watson
      t.float :extraversion_speech_watson
      t.float :agreeableness_speech_watson
      t.float :emotional_range_speech_watson
      t.integer :facial_emotions_rating
      t.integer :social_tone_rating
      t.integer :language_tone_rating
      t.integer :emotion_tone_rating
      t.string :video_file_name
      t.string :video_content_type
      t.integer :video_file_size
      t.datetime :video_updated_at
      t.integer :video_id
      t.string :uuid

      t.timestamps
    end
  end
end
