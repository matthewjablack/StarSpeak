import React from 'react';

export async function checkIpSession(){
  try {
    let response = await fetch('/api/v1/ip_sessions.json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin'
    })

    let responseJson = await response.json();
    return responseJson.success;
  } catch(error) {
    console.log(error);
  }
}

export async function getDaleChall(text, count){
  let response = await fetch('/api/v1/dalechall.json', {
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      text: text,
      count: count
    })
  })
  let responseJson = await response.json();
  return responseJson.data
}

export async function createSpeechstat(user, lesson, moduler, indico, watson, local, browser, uuid, mode, facialEmotions) {
  if (user.auth_token !== null) {

    let starViewData = {};

    if (mode === "StarView") {
      starViewData = {
        user_id: user.id,
        betacode_id: user.betacode_id, 
        lesson_id: lesson.id,
        moduler_id: moduler.id
      }
    } else {
      starViewData = {
        user_id: user.id,
        betacode_id: user.betacode_id, 
      }
    }

    let speechStatData = {
      happy_facial_indico: indico.facialEmotion.happy,
      sad_facial_indico: indico.facialEmotion.sad,
      angry_facial_indico: indico.facialEmotion.angry,
      fear_facial_indico: indico.facialEmotion.fear,
      surprise_facial_indico: indico.facialEmotion.surprise,
      neutral_facial_indico: indico.facialEmotion.neutral,
      watson_text: watson.stt,
      local_text: local.stt,
      watson_text_pace: watson.pace,
      local_text_pace: local.pace,
      browser_name: browser.name,
      browser_version: browser.version,
      anger_speech_watson: watson.tone.emotion.anger,
      disgust_speech_watson: watson.tone.emotion.disgust,
      fear_speech_watson: watson.tone.emotion.fear,
      joy_speech_watson: watson.tone.emotion.joy,
      sadness_speech_watson: watson.tone.emotion.sadness, 
      analytical_speech_watson: watson.tone.language.analytical,
      confident_speech_watson: watson.tone.language.confident,
      tentative_speech_watson: watson.tone.language.tentative,
      openness_speech_watson: watson.tone.social.openness,
      conscientiousness_speech_watson: watson.tone.social.conscientiousness,
      extraversion_speech_watson: watson.tone.social.extraversion,
      agreeableness_speech_watson: watson.tone.social.agreeableness,
      emotional_range_speech_watson: watson.tone.social.emotionalRange, 
      uuid: uuid
    }

    let response = await fetch('/api/v1/speech_stats.json?auth_token=' + user.auth_token, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        speech_stat: Object.assign(speechStatData, starViewData),
        facial_data: facialEmotions
      })
    })

    let responseJson = await response.json();
    return responseJson.speechstat;
  }
}

export function calculatePace(txt, length) {
  const pace = (60 / length) * txt.split(" ").length;
  return pace;
}