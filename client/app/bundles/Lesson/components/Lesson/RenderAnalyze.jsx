import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stats} from './stats';
import {Progress} from './progress';

export default class RenderAnalyze extends Component {
  render() {
    return (
      <div className="bgWhite">
        <div className="container">
          <h3 className="finishedLink"><a href={this.props.linkback}>Click here when finished</a></h3>
          <h1>Results</h1>
          <p>{this.props.local.stt}</p>
          <p>Pace: {Math.round(this.props.local.pace)} Words per Minute</p>
          <br/>
          <Stats stage={this.props.stage} indico={this.props.indico} />
          <h2>Loading...</h2>
          <Progress value={this.props.percentage * 0.01} />
          {this.props.children}
        </div>
      </div>
    )
  }
}
