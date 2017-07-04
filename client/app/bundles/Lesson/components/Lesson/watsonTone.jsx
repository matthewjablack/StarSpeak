import React from 'react';

let STT_ERROR = "There seems to be a problem with Speech to Text. Try freshing and try again.";
let STT_EMPTY = "We didn't pickup enough text to analyze your presentation. Try reshing, and present a little longer. ";
let CONNECTION_ERROR = "There was a problem with your internet connection. Try refreshing and try again.";

export async function watsonTone(user, text, mode) {
  let emotion = {
          anger: 0.00, 
          disgust: 0.00,
          fear: 0.00, 
          joy: 0.00, 
          sadness: 0.00 };

  let language = {
          analytical: 0.00, 
          confident: 0.00,
          tentative: 0.00 };

  let social = {
          openness: 0.00, 
          conscientiousness: 0.00,
          extraversion: 0.00, 
          agreeableness: 0.00, 
          emotionalRange: 0.00 };
  let errors = [];

  if (text.length > 2 && text.length <= 10) {
    errors.push(STT_EMPTY);
  } else if (text.length > 10) {
    try {
      let auth_token_str = ''
      if (mode == "StarView") {
        let auth_token_str = '?auth_token=' + user.auth_token;
      }

      let response = await fetch('/api/v1/watson_tone.json' + auth_token_str, {
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

      emotion.anger = tones[0].tones[0].score;
      emotion.disgust = tones[0].tones[1].score;
      emotion.fear = tones[0].tones[2].score;
      emotion.joy = tones[0].tones[3].score;
      emotion.sadness = tones[0].tones[4].score;

      language.analytical = tones[1].tones[0].score;
      language.confident = tones[1].tones[1].score;
      language.tentative = tones[1].tones[2].score;

      social.openness = tones[0].tones[0].score;
      social.conscientiousness = tones[0].tones[1].score;
      social.extraversion = tones[0].tones[2].score;
      social.agreeableness = tones[0].tones[3].score;
      social.emotionalRange = tones[0].tones[4].score;
    } catch(error) {
      errors.push(CONNECTION_ERROR);
    }
  } else {
    errors.push(STT_ERROR);
  }

  return {emotion: emotion, language: language, social: social, errors: errors};
}
