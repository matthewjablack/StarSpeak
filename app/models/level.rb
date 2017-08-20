class Level < ApplicationRecord
	has_many :lessons
	has_many :modulers
	has_many :speech_stats
	has_one :user
end
