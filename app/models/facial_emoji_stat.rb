class FacialEmojiStat < ApplicationRecord
  belongs_to :facial_stat
  belongs_to :speech_stat
  belongs_to :user
end
