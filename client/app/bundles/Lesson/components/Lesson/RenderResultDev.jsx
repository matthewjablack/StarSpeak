import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RenderResults from './RenderResults';

let practiceStt = "Leverage agile frameworks to provide a robust synopsis for high level overviews. \
  Iterative approaches to corporate strategy foster collaborative thinking to further the overall value \
  proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity \
  and empowerment."

export default class RenderResultDev extends Component{

  constructor(props) {
    super(props);
    this.state = {
      local: {
        stt: practiceStt,
        pace: 115,
      },
      watson: {
        stt: practiceStt,
        pace: 115,
        tone: {
          emotion: {
            anger: 0.13,
            disgust: 0.14,
            fear: 0.17,
            joy: 0.21,
            sadness: 0.29,
          },
          language: {
            analytical: 0.19,
            confident: 0.21,
            tentative: 0.33,
          },
          social: {
            openness: 0.34,
            conscientiousness: 0.19,
            extraversion: 0.21,
            agreeableness: 0.29,
            emotionalRange: 0.31,
          },
          errors: [],
        }
      },
      stage: 'Results',
      indico: {
        facialEmotion: {
          happy: 0.19,
          sad: 0.21,
          angry: 0.13,
          fear: 0.14,
          surprise: 0.18,
          neutral: 0.29,
          eCount: 0,
        },
        confidence: 0.00,
      },
      linkback: '/1/1/lessons',
      percentage: 0.00,
      user: {
        name: "Test User",
        first_name: "Matthew",
      },
      screenshot: '/images/user_demo.png',
      umCount: 2,
      gradeScore: 6.0
    };
  }

  render() {
    return(
      <RenderResults
        local={this.state.local}
        watson={this.state.watson}
        stage={this.state.stage}
        indico={this.state.indico}
        linkback={this.state.linkback}
        percentage={this.state.percentage}
        user={this.state.user}
        screenshot={this.state.screenshot}
        umCount={this.state.umCount} 
        gradeScore={this.state.gradeScore} />
    )
  }
}
