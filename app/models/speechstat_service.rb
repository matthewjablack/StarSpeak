class SpeechstatService
	attr_reader :speechstat, :facial_infos

	def initialize(speechstat:, facial_infos:)
		@speechstat = speechstat
		@facial_emotions = facial_emotions
	end

	def save
		speechstat.save

		facial_infos.each do |facial_info|

      facial = speechstat.facials.build(
        user_id: speechstat.user_id,
        face_count: facial_info.faces,
        frame: facial_info.frame
      )

      facial_appearance = speechstat.facial_appearances.build(
        facial_id: facial.id,
        user_id: speechstat.user_id,
        frame: facial_info.frame,
        gender: facial_info.appearances.gender,
        age: facial_info.appearances.age,
        ethnicity: facial_info.appearances.ethnicity
      )

      facial_emotion = speechstat.facial_emotions.build(
        facial_id: facial.id, 
        user_id: speechstat.user_id,
        frame: facial_info.frame,
        joy: facial_info.emotions.joy,
        sadness: facial_info.emotions.sadness,
        disgust: facial_info.emotions.disgust,
        contempt: facial_info.emotions.contempt,
        anger: facial_info.emotions.anger,
        fear: facial_info.emotions.fear,
        surprise: facial_info.emotions.surprise,
        valance: facial_info.emotions.valance,
        engagement: facial_info.emotions.engagement
      )

      facial_expression = speechstat.facial_expressions.build(
        facial_id: facial.id, 
        user_id: speechstat.user_id,
        frame: facial_info.frame,
        smile: facial_info.expressions.smile,
        inner_brow_raise: facial_info.expressions.inner_brow_raise,
        brow_raise: facial_info.expressions.brow_raise,
        brow_furrow: facial_info.expressions.brow_furrow,
        nose_wrinkle: facial_info.expressions.nose_wrinkle,
        upper_lip_raise: facial_info.expressions.upper_lip_raise,
        lip_corner_depressor: facial_info.expressions.lip_corner_depressor,
        chin_raise: facial_info.expressions.chin_raise,
        lip_pucker: facial_info.expressions.lip_pucker,
        lip_press: facial_info.expressions.lip_press,
        lip_suck: facial_info.expressions.lip_suck,
        mouth_open: facial_info.expressions.mouth_open,
        smirk: facial_info.expressions.smirk,
        eye_closure: facial_info.expressions.eye_closure,
        attention: facial_info.expressions.attention,
        lid_tighten: facial_info.expressions.lid_tighten,
        jaw_drop: facial_info.expressions.jaw_drop,
        simpler: facial_info.expressions.simpler,
        eye_widen: facial_info.expressions.eye_widen,
        cheek_raise: facial_info.expressions.cheek_raise,
        lip_stretch: facial_info.expressions.lip_stretch
      )

      facial_emoji = speechstat.facial_emojis.build(
        facial_id: facial.id, 
        user_id: speechstat.user_id,
        frame: facial_info.frame,
        relaxed: facial_info.emojis.relaxed,
        smiley: facial_info.emojis.smiley,
        laughing: facial_info.emojis.laughing,
        kissing: facial_info.emojis.kissing,
        disappointed: facial_info.emojis.disappointed
      )

      facial.save
      facial_appearance.save
      facial_emotion.save
      facial_expression.save
      facial_emoji.save

      facial.update_attributes(
        facial_appearance_id: facial_appearance.id,
        facial_emotion_id: facial_emotion.id,
        facial_expression_id: facial_expression.id,
        facial_emoji_id: facial_emoji.id
      )
		end
	end
end