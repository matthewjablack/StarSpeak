class CreateSpeechstats < ActiveRecord::Migration[5.0]
  def change
    create_table :speechstats do |t|
      t.integer :user_id
      t.integer :betacode_id
      t.integer :lesson_id
      t.integer :moduler_id
      t.integer :lesson_id
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

      t.timestamps
    end
  end
end
