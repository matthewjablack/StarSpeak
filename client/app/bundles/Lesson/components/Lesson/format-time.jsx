import React from 'react';

export function formatSeconds(seconds) {
    let hours = Math.floor(seconds/3600);
    let remh = seconds % 3600;
    let minutes = Math.floor(remh/60);
    let seconds2 = remh % 60;
    return formatDigit(hours) + ":" + formatDigit(minutes) + ":" + formatDigit(seconds2);
}

function formatDigit(number) {
    if(number < 10) {
		return "0" + number.toString();
    } else {
		return number.toString();
    }
}