class Speechstat < ApplicationRecord
	belongs_to :betacode
	belongs_to :lesson
	belongs_to :level
	belongs_to :moduler
	belongs_to :user
	has_one :video
end
