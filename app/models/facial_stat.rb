class FacialStat < ApplicationRecord
  belongs_to :speech_stat
  belongs_to :user

  has_one :facial_appearance_stat
  has_one :facial_emotion_stat
  has_one :facial_expression_stat
  has_one :facial_emoji_stat
end
