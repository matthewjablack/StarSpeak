import React from 'react';
import {num} from './common';


export async function getIndicoEmotions(screenshots, txt) {
	let facialEmotion = {eCount: 0, happy: 0, sad: 0, angry: 0, fear: 0, surprise: 0, neutral: 0};
	for (var i = 0; i < screenshots.length; i++) {
		facialEmotion = await getFacialEmotion(screenshots[i], facialEmotion);
	}
	let speechEmotion = await getSpeechEmotion(txt);
	let personality = await getPersonality(txt);

	return {facialEmotion: facialEmotion, speechEmotion: speechEmotion, personality: personality};
}

async function getFacialEmotion(screenshot, facialEmotion) {
	let response = await fetch('https://apiv2.indico.io/fer', {
    method: 'POST',
    body: JSON.stringify({
      'api_key': "016fe87430f6925ba984a78f83b93fe1",
      'data': screenshot,
      'detect': true
    })
  })

  let responseJson = await response.json();

  if (responseJson.results[0] && typeof responseJson.results[0].emotions != 'undefined') {

    var emotions = responseJson.results[0].emotions;

    console.log('facialEmotion');
    console.log(facialEmotion);
    console.log(facialEmotion.happy);
    console.log(emotions)

    // return emotions

    var count = facialEmotion.eCount + 1;
    facialEmotion.eCount += 1;
    facialEmotion.happy = (facialEmotion.happy * (count-1) + num(emotions['Happy'])) / count;
		facialEmotion.sad = (facialEmotion.sad * (count-1) + num(emotions['Sad'])) / count;
		facialEmotion.angry = (facialEmotion.angry * (count-1) + num(emotions['Angry'])) / count;
		facialEmotion.fear = (facialEmotion.fear * (count-1) + num(emotions['Fear'])) / count;
		facialEmotion.surprise = (facialEmotion.surprise * (count-1) + num(emotions['Surprise'])) / count;
		facialEmotion.neutral = (facialEmotion.neutral * (count-1) + num(emotions['Neutral'])) / count;

		console.log("new faceEm");
		console.log(facialEmotion);

		
  }
  return facialEmotion;
}


async function getSpeechEmotion(txt) {
	let response = await fetch('https://apiv2.indico.io/emotion ', {
    method: 'POST',
    body: JSON.stringify({
      'api_key': "016fe87430f6925ba984a78f83b93fe1",
      "data": txt,
      'threshold': 0.1
    })
  })

  let responseJson = await response.json();

  var speechEmotion = {happy: 0, sad: 0, angry: 0, fear: 0, surprise: 0};
  if (responseJson.results) {
    var emotions = responseJson.results;
    speechEmotion.happy = num(emotions['joy']);
    speechEmotion.sad = num(emotions['sadness']);
    speechEmotion.angry = num(emotions['anger']);
    speechEmotion.fear = num(emotions['fear']);
    speechEmotion.surprise = num(emotions['surprise']);
  }
  return speechEmotion;
}

async function getPersonality(txt) {
	let response = await fetch('https://apiv2.indico.io/personality ', {
    method: 'POST',
    body: JSON.stringify({
      'api_key': "016fe87430f6925ba984a78f83b93fe1",
      "data": txt
    })
  })

  let responseJson = await response.json();

  var personality = {agreeableness: 0, conscientiousness: 0, extraversion: 0, openness: 0};
  if (responseJson.results) {
    var emotions = responseJson.results;
    personality.agreeableness = num(emotions['agreeableness']);
    personality.conscientiousness = num(emotions['conscientiousness']);
    personality.extraversion = num(emotions['extraversion']);
    personality.openness = num(emotions['openness']);
  }
  return personality;
}
