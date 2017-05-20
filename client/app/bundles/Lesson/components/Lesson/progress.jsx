import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, Col, Row } from 'react-bootstrap';

export function Progress(props) {
  return (
    <ProgressBar now={props.value * 100} label={`${Math.round(props.value * 100)}%`} />
  )
}

Progress.propTypes = {
  value: React.PropTypes.number.isRequired,
};
