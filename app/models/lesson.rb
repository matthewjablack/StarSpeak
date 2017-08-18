class Lesson < ApplicationRecord
	belongs_to :level
	belongs_to :moduler
	has_many :speech_stats
end
