import React from 'react';

export function num(i) {
	if (i && typeof i != 'undefined') {
		return i;
	} else {
		return 0;
	}
}

export function getSortedHash(inputHash){
  var resultHash = {};

  var keys = Object.keys(inputHash);
  keys.sort(function(a, b) {
    return inputHash[a] - inputHash[b]
  }).reverse().forEach(function(k) {
    resultHash[k] = inputHash[k];
  });
  return resultHash;
}