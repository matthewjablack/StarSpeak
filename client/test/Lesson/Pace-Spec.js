/* eslint-disable */

import React from 'react';
import { mount } from 'enzyme';
import Pace from '../../app/bundles/Lesson/components/Lesson/Pace.jsx';
// import jasmine from 'jasmine';

describe('Pace', () => {
	let props = {
    pace: 120
  };
  let mountedPace;
  const pace = () => {
    if (!mountedPace) {
      mountedPace = mount(
        <Pace pace={120} />
      );
    }
    return mountedPace;
  }

  it('always renders a div', () => {
    const divs = pace().find('div');
    expect(divs.length).toBeGreaterThan(0);
  });
});
