class Betacode < ApplicationRecord
	has_many :users
	has_many :speech_stats
end
