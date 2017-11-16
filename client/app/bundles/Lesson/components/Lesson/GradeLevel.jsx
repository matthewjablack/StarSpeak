import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CollapsibleItem} from '@mblackmblack/react-materialize';

export default class GradeLevel extends Component {
  render() {
    const { ...other } = this.props;

    let gradeLevel, gradeHeader;
    if (this.props.gradeScore < 5.0) {
      gradeLevel = '4th Grade';
      gradeHeader = "Your speech is suitable for most audiences.";
    } else if (this.props.gradeScore < 6.0) {
      gradeLevel = '6th Grade';
      gradeHeader = "Your speech is suitable for most audiences.";
    } else if (this.props.gradeScore < 7.0) {
      gradeLevel = '8th Grade';
      gradeHeader = "Your speech is suitable for an educated audience.";
    } else if (this.props.gradeScore < 8.0) {
      gradeLevel = '10th Grade';
      gradeHeader = "Your speech is suitable for an educated audience.";
    } else if (this.props.gradeScore < 9.0) {
      gradeLevel = '12th Grade';
      gradeHeader = "Your speech is suitable for a very knowledgeable audience.";
    } else if (this.props.gradeScore >= 9.0) {
      gradeLevel = 'University';
      gradeHeader = "Your speech is suitable for a very knowledgeable audience.";
    }

    return (
      <CollapsibleItem header={gradeHeader} icon='error' {...other}>
        <p>Your speaking grade level was {gradeLevel}. </p>
        <p>This doesn't mean you spoke like a {gradeLevel} student, but rather that anyone in {gradeLevel} or older would be capable of understanding your speech.</p>
      </CollapsibleItem>
    )
  }
}
