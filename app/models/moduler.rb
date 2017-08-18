class Moduler < ApplicationRecord
	has_many :lessons
	has_many :speech_stats
	belongs_to :level
end
