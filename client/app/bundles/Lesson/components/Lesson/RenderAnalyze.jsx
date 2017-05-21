import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stats} from './stats';

export default class RenderAnalyze extends Component {
  render() {
    return (
      <div className="bgWhite">
        <div className="container">
          <h3 className="finishedLink"><a href={this.props.linkback}>Click here when finished</a></h3>
          <h1>Results</h1>
          <p>{this.props.local.sst}</p>
          <p>Pace: {Math.round(this.props.local.pace)} Words per Minute</p>
          <br/>
          <Stats stage={this.props.stage} indico={this.props.indico} />
        </div>
      </div>
    )
  }
}
