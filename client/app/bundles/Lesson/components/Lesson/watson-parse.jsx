import React from 'react';

export function parseWatson(messages) {
	let full_message = "";

    messages.forEach(function(msg) {
      msg.results.forEach(function(result) {
        full_message += result.alternatives[0].transcript;
      })
    })
    return full_message;
}

export function fetchToken() {
	let response = fetch('https://view.starspeak.io/api/token');

	let responseJson = response.json();

	return responseJson.text();

	// if (responseJson.results[0] && typeof responseJson.results[0].emotions != 'undefined') {

	// }




	// return fetch('https://view.starspeak.io/api/token').then(res => {
	//   if (res.status != 200) {
	//     throw new Error('Error retrieving auth token');
	//   }
	//   console.log(res.text());
	//   return res.text();
	// })
}