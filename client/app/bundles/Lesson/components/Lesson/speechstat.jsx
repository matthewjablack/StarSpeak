import React from 'react';

export async function createSpeechstat(user, lesson, moduler, indico, watson, local, browser) {
	if (user.auth_token !== null) {
    let response3 = await fetch(
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
      '&happy_speech_indico=' + indico.speechEmotion.happy + 
      '&sad_speech_indico=' + indico.speechEmotion.sad + 
      '&angry_speech_indico=' + indico.speechEmotion.angry + 
      '&fear_speech_indico=' + indico.speechEmotion.fear + 
      '&surprise_speech_indico=' + indico.speechEmotion.surprise + 
      '&agreeableness_indico=' + indico.personality.agreeableness + 
      '&conscientiousness_indico=' + indico.personality.conscientiousness + 
      '&extraversion_indico=' + indico.personality.extraversion + 
      '&openness_indico=' + indico.personality.openness + 
      '&watson_text=' + watson.stt + 
      '&local_text=' + local.stt + 
      '&watson_text_pace=' + watson.pace + 
      '&local_text_pace=' + local.pace + 
      '&browser_name=' + browser.name + 
      '&browser_version=' + browser.version
      , {
      method: 'POST',
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