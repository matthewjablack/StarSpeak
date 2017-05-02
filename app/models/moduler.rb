class Moduler < ApplicationRecord
	has_many :lessons
	belongs_to :level
end
