import React from 'react';

export async function watsonTone(auth_token, text) {
  let response = await fetch('/api/v1/watson_tone.json?auth_token=' + auth_token, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      'text': text,
    })
  })

  let responseJson = await response.json();

  let tones = responseJson.result.document_tone.tone_categories;

  let emotion = {
          anger: tones[0].tones[0].score, 
          disgust: tones[0].tones[1].score,
          fear: tones[0].tones[2].score, 
          joy: tones[0].tones[3].score, 
          sadness: tones[0].tones[4].score };

  let language = {
          analytical: tones[1].tones[0].score, 
          confident: tones[1].tones[1].score,
          tentative: tones[1].tones[2].score };

  let social = {
          openness: tones[0].tones[0].score, 
          conscientiousness: tones[0].tones[1].score,
          extraversion: tones[0].tones[2].score, 
          agreeableness: tones[0].tones[3].score, 
          emotionalRange: tones[0].tones[4].score };

  return {emotion: emotion, language: language, social: social};
}
