class SpeechStat < ApplicationRecord
	belongs_to :betacode
	belongs_to :lesson
	belongs_to :level
	belongs_to :moduler
	belongs_to :user
	belongs_to :video

	has_many :facial_stats
	has_many :facial_appearance_stats
	has_many :facial_emotion_stats
	has_many :facial_expression_stats
	has_many :facial_emoji_stats
end
