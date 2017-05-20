import React from 'react';

export function num(i) {
	if (i && typeof i != 'undefined') {
		return i;
	} else {
		return 0;
	}
}