class Speechstat < ApplicationRecord
	belongs_to :betacode
	belongs_to :lesson
	belongs_to :level
	belongs_to :moduler
	belongs_to :user
	belongs_to :video

	has_many :facials
	has_many :facial_appearances
	has_many :facial_emotions
	has_many :facial_expressions
	has_many :facial_emojis
end
