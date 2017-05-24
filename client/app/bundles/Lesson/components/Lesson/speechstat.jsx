import React from 'react';

export async function createSpeechstat(user, lesson, moduler, indico, watson, local, browser, uuid) {
  if (user.auth_token !== null) {
    let response = await fetch(
      '/api/v1/speechstats.json?auth_token=' + user.auth_token +
      '&user_id=' + user.id +
      '&betacode_id=' + user.betacode_id + 
      '&lesson_id=' + lesson.id + 
      '&moduler_id=' + moduler.id + 
      '&happy_facial_indico=' + indico.facialEmotion.happy + 
      '&sad_facial_indico=' + indico.facialEmotion.sad + 
      '&angry_facial_indico=' + indico.facialEmotion.angry + 
      '&fear_facial_indico=' + indico.facialEmotion.fear + 
      '&surprise_facial_indico=' + indico.facialEmotion.surprise + 
      '&neutral_facial_indico=' + indico.facialEmotion.neutral + 
      '&watson_text=' + watson.stt + 
      '&local_text=' + local.stt + 
      '&watson_text_pace=' + watson.pace + 
      '&local_text_pace=' + local.pace + 
      '&browser_name=' + browser.name + 
      '&browser_version=' + browser.version + 
      '&anger_speech_watson=' + watson.tone.emotion.anger + 
      '&disgust_speech_watson=' + watson.tone.emotion.disgust + 
      '&fear_speech_watson=' + watson.tone.emotion.fear + 
      '&joy_speech_watson=' + watson.tone.emotion.joy + 
      '&sadness_speech_watson=' + watson.tone.emotion.sadness + 
      '&analytical_speech_watson=' + watson.tone.language.analytical + 
      '&confident_speech_watson=' + watson.tone.language.confident + 
      '&tentative_speech_watson=' + watson.tone.language.tentative + 
      '&openness_speech_watson=' + watson.tone.social.openness + 
      '&conscientiousness_speech_watson=' + watson.tone.social.conscientiousness + 
      '&extraversion_speech_watson=' + watson.tone.social.extraversion + 
      '&agreeableness_speech_watson=' + watson.tone.social.agreeableness + 
      '&emotional_range_speech_watson=' + watson.tone.social.emotionalRange + 
      '&uuid=' + uuid
      , {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }) 
    let responseJson = response.json();
    return responseJson.speechstat;
  }
}

export async function updateRating(ratingName, ratingValue) {
	if (user.auth_token !== null) {
    let response3 = await fetch(
      '/api/v1/speechstats.json?auth_token=' + user.auth_token +
      '&facial_emotions_rating=' + ratingName +
			'&social_tone_rating=' + ratingName +
			'&language_tone_rating=' + ratingName +
			'&emotion_tone_rating=' + ratingName +
      , {
      method: 'PUT',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}

export function calculatePace(txt, length) {
  const pace = (60 / length) * txt.split(" ").length;
  return pace;
}
