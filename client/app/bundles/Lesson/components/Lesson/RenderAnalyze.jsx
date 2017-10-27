import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stats} from './stats';
import Pace from './Pace';
import UmCount from './UmCount';
import GradeLevel from './GradeLevel';
import { ProgressBar, Collapsible, CollapsibleItem, Row, Card, Button, Icon } from '@mblackmblack/react-materialize';

export default class RenderAnalyze extends Component {
  render() {
    return (
      <div className="bgWhite">
        <div className="container">
          <a className='btn red lighten-2' href={this.props.linkback}>Click here when finished<Icon left>reply</Icon></a><br/>

          <Row>
            <Card className="hoverable center">
              <h4>Hey {this.props.user.first_name}, here are your presentation results</h4>
              <p>{this.props.local.stt}</p><br/>
              <img src={this.props.screenshot} style={{objectFit: 'cover', borderRadius:100, width: 150, height: 150}}/>
            </Card>
          </Row>

          <Collapsible accordion popout defaultActiveKey={0}>
            <Pace pace={this.props.local.pace} />
            <UmCount umCount={this.props.umCount} />
            <GradeLevel gradeScore={this.props.gradeScore} />
          </Collapsible>

          <br/>
          <Stats stage={this.props.stage} indico={this.props.indico} watson={this.props.watson} local={this.props.local} user={this.props.user} mode={this.props.mode} />
          <h2>Uploading...{Math.floor(this.props.percentUploaded)}%</h2>
          <ProgressBar className="red" progress={this.props.percentUploaded}/>
          <h2>Loading...{Math.floor(this.props.percentage)}%</h2>
          <ProgressBar className="red" progress={this.props.percentage}/>
          {this.props.children}
        </div>
      </div>
    )
  }
}
