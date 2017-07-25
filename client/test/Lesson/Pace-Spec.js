/* eslint-disable */

import React from 'react';
import { mount } from 'enzyme';
import Pace from '../../app/bundles/Lesson/components/Lesson/Pace.jsx';

describe('Pace', () => {
  it('displays no words for 0 WPM', () => {
    const pace = mount(<Pace pace={0} />);
    const paceText = pace.find('p').first();
    const paceFeedback = pace.find('p').last();
    expect(paceText.length).toBeGreaterThan(0);
    expect(paceText.text()).toEqual('We couldn\'t detect any words from your speech. Double check your microphone and try again.');
  });

  it('displays too slow for 25 WPM', () => {
    const pace = mount(<Pace pace={25} />);
    const paceText = pace.find('p').first();
    const paceFeedback = pace.find('p').last();
    expect(paceText.length).toBeGreaterThan(0);
    expect(paceFeedback.length).toBeGreaterThan(0);
    expect(paceText.text()).toEqual('Pace: 25 Words per Minute');
    expect(paceFeedback.text()).toEqual('Your talking pace was very slow. Try working on reducing your pauses.');
  });

  it('displays too slow for 100 WPM', () => {
    const pace = mount(<Pace pace={100} />);
    const paceText = pace.find('p').first();
    const paceFeedback = pace.find('p').last();
    expect(paceText.length).toBeGreaterThan(0);
    expect(paceFeedback.length).toBeGreaterThan(0);
    expect(paceText.text()).toEqual('Pace: 100 Words per Minute');
    expect(paceFeedback.text()).toEqual('Your talking pace was slightly slow. Be sure not to have too many pauses.');
  });

  it('displays excellent for 120 WPM', () => {
    const pace = mount(<Pace pace={120} />);
    const paceText = pace.find('p').first();
    const paceFeedback = pace.find('p').last();
    expect(paceText.length).toBeGreaterThan(0);
    expect(paceFeedback.length).toBeGreaterThan(0);
    expect(paceText.text()).toEqual('Pace: 120 Words per Minute');
    expect(paceFeedback.text()).toEqual('Excellent talking pace. Keep it up!');
  });

  it('displays excellent for 145 WPM', () => {
    const pace = mount(<Pace pace={145} />);
    const paceText = pace.find('p').first();
    const paceFeedback = pace.find('p').last();
    expect(paceText.length).toBeGreaterThan(0);
    expect(paceFeedback.length).toBeGreaterThan(0);
    expect(paceText.text()).toEqual('Pace: 145 Words per Minute');
    expect(paceFeedback.text()).toEqual('Excellent talking pace. Keep it up!');
  });

  it('displays too fast for 175 WPM', () => {
    const pace = mount(<Pace pace={175} />);
    const paceText = pace.find('p').first();
    const paceFeedback = pace.find('p').last();
    expect(paceText.length).toBeGreaterThan(0);
    expect(paceFeedback.length).toBeGreaterThan(0);
    expect(paceText.text()).toEqual('Pace: 175 Words per Minute');
    expect(paceFeedback.text()).toEqual('Your talking pace was slightly fast. Try slowing down a little.');
  });

  it('displays way too fast for 250 WPM', () => {
    const pace = mount(<Pace pace={250} />);
    const paceText = pace.find('p').first();
    const paceFeedback = pace.find('p').last();
    expect(paceText.length).toBeGreaterThan(0);
    expect(paceFeedback.length).toBeGreaterThan(0);
    expect(paceText.text()).toEqual('Pace: 250 Words per Minute');
    expect(paceFeedback.text()).toEqual('You\'re talking way too fast! Try slowing down.');
  });
});

