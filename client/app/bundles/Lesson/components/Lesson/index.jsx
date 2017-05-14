import React from 'react';
import Lesson from './Lesson';

const title = 'Lesson Us';

export default {

  path: '/',

  action() {
    return {
      title,
      component: <Lesson />,
    };
  },

};
