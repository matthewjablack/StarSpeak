import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';

export default class RenderPreload extends Component {


  constructor(props) {
    super(props)
    this.state = {

      confidenceImgUrlList: [
        '/images/confidence/confidence_0_grey.png',
        '/images/confidence/confidence_1_grey.png',
        '/images/confidence/confidence_2_grey.png',
        '/images/confidence/confidence_3_grey.png',
        '/images/confidence/confidence_4.png',
        '/images/confidence/confidence_5_grey.png',
        '/images/confidence/confidence_6_grey.png',
        '/images/confidence/confidence_7_grey.png',
        '/images/confidence/confidence_8_grey.png'
      ]
    }
  }

  setElements() {
    this.setConfidenceForm();
    if (this.props.affectivaLoaded) {
      this.speechAnalyticsSection = (
        <div>
          <p>loaded!</p>
          <Button className="red lighten-2" waves="light" onClick={this.props.startStageRecord}>
            continue
          </Button>
        </div>
      )
    } else {
      this.speechAnalyticsSection = (
        <p>Loading...</p>
      )
    }
  }

  setConfidenceForm() {
    this.formStyle = {
      width: 40,
      height: 40,
      marginRight: 20
    }

    this.confidenceForm = (
      <div>
        <h3>How confident are you speaking about this topic?</h3>
        <div>
          <img src={this.state.confidenceImgUrlList[0]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(0)} />
          <img src={this.state.confidenceImgUrlList[1]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(1)} />
          <img src={this.state.confidenceImgUrlList[2]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(2)} />
          <img src={this.state.confidenceImgUrlList[3]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(3)} />
          <img src={this.state.confidenceImgUrlList[4]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(4)} />
          <img src={this.state.confidenceImgUrlList[5]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(5)} />
          <img src={this.state.confidenceImgUrlList[6]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(6)} />
          <img src={this.state.confidenceImgUrlList[7]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(7)} />
          <img src={this.state.confidenceImgUrlList[8]} style={this.formStyle} onClick={() => this.onConfidenceGoalChange(8)} />
        </div>
      </div>
      )
  }

  onConfidenceGoalChange(newVal) {
    this.props.setConfidenceGoal(newVal)
    this.updateConfidenceFormView(newVal);
  }

  updateConfidenceFormView(newVal) {
    var newUrlList = [];
    for (var i = 0; i < 9; i++) {
      var grey = "_grey";
      if (i === newVal) {
        grey = "";
      }
      var imgUrl = '/images/confidence/confidence_' + i + grey + '.png';
      newUrlList.push(imgUrl);
    }

    this.setState({
      confidenceImgUrlList: newUrlList
    });
  }

  onEmotionGoalChange(emotionType, value) {
    this.setColour(emotionType, value)
    this.setEmotionValue(emotionType, value)
  }

  getEmotionNoun(adjective) {
    if (adjective === 'happy') {
      return 'happiness';
    } else if (adjective === 'sad') {
      return 'sadness';
    } else if (adjective === 'excited') {
      return 'excitement';
    } else if (adjective === 'angry') {
      return 'anger';
    }
  }

  setColour(emotionType, value) {
    let newEmotionImgUrlList = Object.assign({}, this.state.emotionImgUrlList)

    for (var i = 0; i <= 3; i++) {
      var grey = ""
      var imgUrl = "/images/emotion_list/"
      if (i !== value) {
        grey = "_grey"
      }
      imgUrl =imgUrl + emotionType + '/' + emotionType + '_' + i + grey + ".png"
      newEmotionImgUrlList[emotionType+i] = imgUrl
    }
    this.setState({
      emotionImgUrlList: newEmotionImgUrlList
    })
  }


  render() {
    this.setElements();


    /* TODO: 'children' removable? */
    return (
      <div>
        <div className="centerFixed">
        {this.confidenceForm}
        {this.speechAnalyticsSection}

        </div>
        {this.props.children}
      </div>
    )
  }
}
