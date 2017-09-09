import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class GradeLevel extends Component {
  render() {
    let gradeLevel;
    if (this.props.gradeScore === 0) {
      gradeLevel = '';
    } else if (this.props.gradeScore < 5.0) {
      gradeLevel = '4th Grade';
    } else if (this.props.gradeScore < 6.0) {
      gradeLevel = '6th Grade';
    } else if (this.props.gradeScore < 7.0) {
      gradeLevel = '8th Grade';
    } else if (this.props.gradeScore < 8.0) {
      gradeLevel = '10th Grade';
    } else if (this.props.gradeScore < 9.0) {
      gradeLevel = '12th Grade';
    } else if (this.props.gradeScore < 10.0) {
      gradeLevel = 'University';
    }

    return (
      <p>Speaking Level: {gradeLevel}</p>
    )
  }
}
