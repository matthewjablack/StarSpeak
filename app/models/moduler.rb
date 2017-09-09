class Moduler < ApplicationRecord
	has_many :lessons
	has_many :speechstats
	belongs_to :level
end
