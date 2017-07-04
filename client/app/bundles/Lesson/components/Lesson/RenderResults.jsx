import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stats} from './stats';
import Pace from './Pace';
import UmCount from './UmCount';

export default class RenderResults extends Component {
  render() {
    return (
      <div className="bgWhite">
        <div className="container">
          <h3 className="finishedLink"><a href={this.props.linkback}>Click here when finished</a></h3>
          <h1>Results</h1>
          <p>{this.props.local.stt}</p>
          <Pace pace={this.props.local.pace} />
          <UmCount umCount={this.props.umCount} />
          <br/>
          <Stats stage={this.props.stage} indico={this.props.indico} watson={this.props.watson} user={this.props.user} screenshot={this.props.screenshot} local={this.props.local} />
          {this.props.children}
          <br/><br/>
          <p></p>
        </div>
      </div>
    )
  }
}
