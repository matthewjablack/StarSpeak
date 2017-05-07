class Level < ApplicationRecord
	has_many :lessons
	has_many :modulers
	has_many :speechstats
	has_one :user
end
