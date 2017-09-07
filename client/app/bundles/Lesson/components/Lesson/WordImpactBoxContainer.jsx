import React, {Component} from 'react';
import PropTypes from 'prop-types';
import WordImpactBox from './WordImpactBox';

export default class WordImpactBoxContainer extends Component {
  constructor(props) {
    super(props);
  }

  findByFrame(frame, data){
    return data.filter(x => x.frame === frame)[0];
  }

  render() {
    let _this = this;

    return (
      <div>
        {this.props.speechFrameContainer.formattedData.map((speechFrame) => 
          <WordImpactBox 
            speechFrame={speechFrame} 
            facialStat={this.findByFrame(speechFrame.frame, _this.props.facialStatsContainer.data)} 
          />
        )}
      </div>
    )
  }
}
