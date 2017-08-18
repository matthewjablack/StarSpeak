class SpeechStatService
	attr_reader :speech_stat, :facial_data

	def initialize(speech_stat:, facial_data:)
		@speech_stat = speech_stat
		@facial_data = facial_data
	end

	def save
		speech_stat.save

    ActiveRecord::Base.transaction do

  		facial_data.each do |facial_datum|

        facial_stat = speech_stat.facial_stats.build(
          user_id: speech_stat.user_id,
          face_count: facial_datum["faces"],
          frame: facial_datum["frame"]
        )

        facial_stat.save!

        facial_appearance_stat = speech_stat.facial_appearance_stats.build(
          facial_stat_id: facial_stat.id,
          user_id: speech_stat.user_id,
          frame: facial_datum["frame"],
          gender: facial_datum["appearances"].try("gender"),
          age: facial_datum["appearances"].try("age"),
          ethnicity: facial_datum["appearances"].try("ethnicity")
        )

        facial_emotion_stat = speech_stat.facial_emotion_stats.build(
          facial_stat_id: facial_stat.id, 
          user_id: speech_stat.user_id,
          frame: facial_datum["frame"],
          joy: facial_datum["emotions"].try("joy"),
          sadness: facial_datum["emotions"].try("sadness"),
          disgust: facial_datum["emotions"].try("disgust"),
          contempt: facial_datum["emotions"].try("contempt"),
          anger: facial_datum["emotions"].try("anger"),
          fear: facial_datum["emotions"].try("fear"),
          surprise: facial_datum["emotions"].try("surprise"),
          valance: facial_datum["emotions"].try("valance"),
          engagement: facial_datum["emotions"].try("engagement")
        )

        facial_expression_stat = speech_stat.facial_expression_stats.build(
          facial_stat_id: facial_stat.id, 
          user_id: speech_stat.user_id,
          frame: facial_datum["frame"],
          smile: facial_datum["expressions"].try("smile"),
          inner_brow_raise: facial_datum["expressions"].try("inner_brow_raise"),
          brow_raise: facial_datum["expressions"].try("brow_raise"),
          brow_furrow: facial_datum["expressions"].try("brow_furrow"),
          nose_wrinkle: facial_datum["expressions"].try("nose_wrinkle"),
          upper_lip_raise: facial_datum["expressions"].try("upper_lip_raise"),
          lip_corner_depressor: facial_datum["expressions"].try("lip_corner_depressor"),
          chin_raise: facial_datum["expressions"].try("chin_raise"),
          lip_pucker: facial_datum["expressions"].try("lip_pucker"),
          lip_press: facial_datum["expressions"].try("lip_press"),
          lip_suck: facial_datum["expressions"].try("lip_suck"),
          mouth_open: facial_datum["expressions"].try("mouth_open"),
          smirk: facial_datum["expressions"].try("smirk"),
          eye_closure: facial_datum["expressions"].try("eye_closure"),
          attention: facial_datum["expressions"].try("attention"),
          lid_tighten: facial_datum["expressions"].try("lid_tighten"),
          jaw_drop: facial_datum["expressions"].try("jaw_drop"),
          simpler: facial_datum["expressions"].try("simpler"),
          eye_widen: facial_datum["expressions"].try("eye_widen"),
          cheek_raise: facial_datum["expressions"].try("cheek_raise"),
          lip_stretch: facial_datum["expressions"].try("lip_stretch")
        )

        facial_emoji_stat = speech_stat.facial_emoji_stats.build(
          facial_stat_id: facial_stat.id, 
          user_id: speech_stat.user_id,
          frame: facial_datum["frame"],
          relaxed: facial_datum["emojis"].try("relaxed"),
          smiley: facial_datum["emojis"].try("smiley"),
          laughing: facial_datum["emojis"].try("laughing"),
          kissing: facial_datum["emojis"].try("kissing"),
          disappointed: facial_datum["emojis"].try("disappointed")
        )
        
        facial_appearance_stat.save
        facial_emotion_stat.save
        facial_expression_stat.save
        facial_emoji_stat.save
  		end
    end
	end
end