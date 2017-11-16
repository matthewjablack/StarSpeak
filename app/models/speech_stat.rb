class SpeechStat < ApplicationRecord
	serialize :word_frequency

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

	before_save :jsonify_word_frequency

	def jsonify_word_frequency
		if self.word_frequency.class == String
			self.word_frequency = JSON.parse(self.word_frequency)
		end
	end
end
