class Level < ApplicationRecord
	has_many :lessons
	has_many :modulers
	has_one :user
end
