import React from 'react';

export function paramsObject() {
  var pairs = window.location.search.substring(1).split("&"), obj = {}, pair, i;

  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;

    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }

  return obj;
}

export function isObjectEmpty(object) {
  if ('object' !== typeof object) {
      throw new Error('Object must be specified.');
  }

  if (null === object) {
      return true;
  }

  if ('undefined' !== Object.keys) {
      return (0 === Object.keys(object).length);
  } else {
      for (var key in object) {
          if (object.hasOwnProperty(key)) {
              return false;
          }
      }
      return true;
  }
} 