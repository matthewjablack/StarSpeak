import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stats} from './stats';
import {Progress} from './progress';
import Pace from './Pace';

export default class RenderAnalyze extends Component {
  render() {
    return (
      <div className="bgWhite">
        <div className="container">
          <h3 className="finishedLink"><a href={this.props.linkback}>Click here when finished</a></h3>
          <h1>Results</h1>
          <p>{this.props.local.stt}</p>
          <Pace pace={this.props.local.pace} />
          <br/>
          <Stats stage={this.props.stage} indico={this.props.indico} watson={this.props.watson} />
          <h2>Loading...</h2>
          <Progress value={this.props.percentage * 0.01} />
          {this.props.children}
        </div>
      </div>
    )
  }
}
