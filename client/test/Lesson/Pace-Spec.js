/* eslint-disable */

import React from 'react';
import { mount } from 'enzyme';
import Pace from '../../app/bundles/Lesson/components/Lesson/Pace.jsx';

describe('Pace', () => {
  it('displays excellent for 120 WPM', () => {
    const pace = mount(<Pace pace={120} />);
    const paceText = pace.find('CollapsibleItem').first();
    const paceFeedback = pace.find('CollapsibleItem').last();
    expect(paceText.length).toBeGreaterThan(0);
    expect(paceFeedback.length).toBeGreaterThan(0);
  });
});

