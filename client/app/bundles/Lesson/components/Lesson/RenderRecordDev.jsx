import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RenderRecord from './RenderRecord';

export default class RenderRecordDev extends Component{

  constructor(props) {
    super(props);
    this.state = {
      affectiva: {
        emotions: {
          joy: 0.98,
          sadness: 0,
          anger: 0,
          surprise: 0.97,
        }
      }
    };
  }

  render() {
    return(
      <RenderRecord
        width={window.innerWidth}
        presentCount={20}
        emotions={this.state.affectiva.emotions}
      />
    )
  }
}
