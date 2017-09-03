import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@mblackmblack/react-materialize'

export default class WordImpactBox extends Component {
  constructor(props) {
    super(props);
    this.formatEmotions = this.formatEmotions.bind(this);
  }

  componentWillMount() {
    this.formatEmotions(this.props.facialStat.emotions);
  }

  formatEmotions(emotions) {
    if (emotions != null) {
      this.setState({
        joy: Math.round(emotions.joy),
        sadness: Math.round(emotions.sadness),
        excitement: Math.round(emotions.surprise),
        anger: Math.round(emotions.anger)
      });
    } else {
      this.setState({joy: 0, sadness: 0, excitement: 0, anger: 0});
    }
  }

  classEmotion(emotions) {
    if (emotions != null){
      if (emotions.joy > 50 && emotions.surprise > 50) {
        return 'green-yellow-chip';
      } else if (emotions.joy > 50) {
        return 'green-chip';
      } else if (emotions.surprise > 50) {
        return 'yellow-chip';
      } else if (emotions.sadness > 50 && emotions.anger > 50) {
        return 'blue-red-chip';
      } else if (emotions.sadness > 50) {
        return 'blue-chip';
      } else if (emotions.anger > 50) {
        return 'anger-chip';
      } else {
        return 'regular-chip';
      }
    } else {
      return 'regular-chip';
    }
  }

  render() {
    return (
      <div className={"chip word-chip tooltip " + this.classEmotion(this.props.facialStat.emotions)}>
        {this.props.speechFrame.text}
        <span className="tooltiptext">
          <p>Joy: {this.state.joy}%</p>
          <p>Sadness: {this.state.sadness}%</p>
          <p>Excitement: {this.state.excitement}%</p>
          <p>Anger: {this.state.anger}%</p>
        </span>
      </div>
    )
  }
}
