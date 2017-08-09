import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stats} from './stats';
import Pace from './Pace';
import UmCount from './UmCount';
import GradeLevel from './GradeLevel';
import {Collapsible, CollapsibleItem, Row, Card, Button, Icon} from '@mblackmblack/react-materialize'

export default class RenderResults extends Component {
  render() {
    return (
      <div className="bgWhite">
        <div className="container">
          <a className='btn red lighten-2' href={this.props.linkback}>Click here when finished<Icon left>reply</Icon></a><br/>

          <Row>
            <Card className="hoverable center">
              <h4>Hey {this.props.user.first_name}, here's your presentation results</h4>
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
          <Stats stage={this.props.stage} indico={this.props.indico} watson={this.props.watson} user={this.props.user} screenshot={this.props.screenshot} local={this.props.local} />
          {this.props.children}
          <br/><br/>
          <p></p>
        </div>
      </div>
    )
  }
}
