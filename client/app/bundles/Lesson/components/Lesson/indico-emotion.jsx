import React from 'react';
import {num} from './common';


let FACE_ERROR = "We couldn't find your face during the presentation. Try refreshing and try again.";
let CONNECTION_ERROR = "There was a problem with your internet connection. Try refreshing and try again.";
let STT_ERROR = "There seems to be a problem with Speech to Text. Try freshing and try again.";
let STT_EMPTY = "We didn't pickup enough text to analyze your presentation. Try reshing, and present a little longer. ";
let CAMERA_ERROR = "Looks like your camera isn't on";


export async function getIndicoEmotions(screenshots, txt, ctx) {
  let percentageCount = 5;
  let facialEmotion = await getFacialEmotion(screenshots);
  ctx.setState({percentage: ctx.state.percentage + (100/percentageCount)*3});

  let errors = facialEmotion.errors;
  errors = errors.filter((val,i)=>{
    return errors.indexOf(val)==i;
  });

  return {facialEmotion: facialEmotion, errors: errors};
}

async function getFacialEmotion(screenshots) {
  let facialEmotion = {eCount: 0, happy: 0, sad: 0, angry: 0, fear: 0, surprise: 0, neutral: 0, errors: []};
  if (screenshots.length === 0) {
    facialEmotion.errors.push(CAMERA_ERROR);
  } else {
    try {
      let response = await fetch('https://apiv2.indico.io/fer/batch', {
        method: 'POST',
        body: JSON.stringify({
          'api_key': "016fe87430f6925ba984a78f83b93fe1",
          'data': screenshots
        })
      })

      let responseJson = await response.json();

      if (responseJson.results) {
        let results = responseJson.results;
        for (var i = 0; i < results.length; i++) {
          var emotions = results[i];
          var count = facialEmotion.eCount + 1;
          facialEmotion.eCount += 1;
          facialEmotion.happy = (facialEmotion.happy * (count-1) + num(emotions['Happy'])) / count;
          facialEmotion.sad = (facialEmotion.sad * (count-1) + num(emotions['Sad'])) / count;
          facialEmotion.angry = (facialEmotion.angry * (count-1) + num(emotions['Angry'])) / count;
          facialEmotion.fear = (facialEmotion.fear * (count-1) + num(emotions['Fear'])) / count;
          facialEmotion.surprise = (facialEmotion.surprise * (count-1) + num(emotions['Surprise'])) / count;
          facialEmotion.neutral = (facialEmotion.neutral * (count-1) + num(emotions['Neutral'])) / count;
          
        }

        if ((facialEmotion.happy * 2) < 1) {
          facialEmotion.happy *= 2;
        }
        facialEmotion.sad *= 0.5;
        facialEmotion.angry *= 0.5;
        facialEmotion.fear *= 0.5;
        if ((facialEmotion.neutral * 2) < 1) {
          facialEmotion.neutral *= 2;
        }
      } else {
        facialEmotion.errors.push(FACE_ERROR);
      }
    } catch(error) {
      facialEmotion.errors.push(CONNECTION_ERROR);
    }
  } 
  return facialEmotion;
}


async function getSpeechEmotion(txt) {
  var speechEmotion = {happy: 0, sad: 0, angry: 0, fear: 0, surprise: 0, errors: []};
  if (txt.length > 0 && txt.length <= 10) {
    speechEmotion.errors.push(STT_EMPTY);
  } else if (txt.length > 10) {
    try {
      let response = await fetch('https://apiv2.indico.io/emotion ', {
        method: 'POST',
        body: JSON.stringify({
          'api_key': "016fe87430f6925ba984a78f83b93fe1",
          "data": txt,
          'threshold': 0.1
        })
      })

      let responseJson = await response.json();

      if (responseJson.results) {
        var emotions = responseJson.results;
        speechEmotion.happy = num(emotions['joy']);
        speechEmotion.sad = num(emotions['sadness']);
        speechEmotion.angry = num(emotions['anger']);
        speechEmotion.fear = num(emotions['fear']);
        speechEmotion.surprise = num(emotions['surprise']);
      } else {
        speechEmotion.errors.push(STT_ERROR);
      }
    } catch(error) {
      speechEmotion.errors.push(CONNECTION_ERROR);
    }
  } else {
    speechEmotion.errors.push(STT_ERROR);
  }
  return speechEmotion;
}

async function getPersonality(txt) {
  var personality = {agreeableness: 0, conscientiousness: 0, extraversion: 0, openness: 0, errors: []};
  if (txt.length > 0 && txt.length <= 10) {
    personality.errors.push(STT_EMPTY);
  } else if (txt.length > 10) {
    try {
      let response = await fetch('https://apiv2.indico.io/personality ', {
        method: 'POST',
        body: JSON.stringify({
          'api_key': "016fe87430f6925ba984a78f83b93fe1",
          "data": txt
        })
      })

      let responseJson = await response.json();

      if (responseJson.results) {
        var emotions = responseJson.results;
        personality.agreeableness = num(emotions['agreeableness']);
        personality.conscientiousness = num(emotions['conscientiousness']);
        personality.extraversion = num(emotions['extraversion']);
        personality.openness = num(emotions['openness']);
      } else {
        personality.errors.push(STT_ERROR )
      }
    } catch(error) {
      personality.errors.push(CONNECTION_ERROR);
    }
  } else {
    personality.errors.push(STT_ERROR);
  }
  return personality;
}
