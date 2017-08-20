import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';

export default class RenderPreload extends Component {


  constructor(props) {
    super(props)
    this.state = {

      emotionImgUrlList: {
        'happy0': '/images/emotion_list/happy/happy_0.png',
        'happy1': '/images/emotion_list/happy/happy_1_grey.png',
        'happy2': '/images/emotion_list/happy/happy_2_grey.png',
        'happy3': '/images/emotion_list/happy/happy_3_grey.png',

        'sad0': '/images/emotion_list/sad/sad_0.png',
        'sad1': '/images/emotion_list/sad/sad_1_grey.png',
        'sad2': '/images/emotion_list/sad/sad_2_grey.png',
        'sad3': '/images/emotion_list/sad/sad_3_grey.png',

        'excited0': '/images/emotion_list/excited/excited_0.png',
        'excited1': '/images/emotion_list/excited/excited_1_grey.png',
        'excited2': '/images/emotion_list/excited/excited_2_grey.png',
        'excited3': '/images/emotion_list/excited/excited_3_grey.png',

        'angry0': '/images/emotion_list/angry/angry_0.png',
        'angry1': '/images/emotion_list/angry/angry_1_grey.png',
        'angry2': '/images/emotion_list/angry/angry_2_grey.png',
        'angry3': '/images/emotion_list/angry/angry_3_grey.png',
      },

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
    this.setEmotionForms();
    this.emotionForm = (
      <div>
      <h2> What kind of emotions do you wish to portray? </h2>
        {this.formList.map(form => <div> {form} <br></br> </div>)}
      </div>
      )
    if (this.props.affectivaLoaded) {
      this.speechAnalyticsSection = (
        <div>
          <p>loaded!</p>
          <Button className="red lighten-2" waves="light" onClick={() => this.props.startStageRecord}>
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
      width: 30,
      height: 30,
      marginRight: 10
    }

    this.confidenceForm = (
      <div>
        <h3> How confident are you discussing this topic? </h3>
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
    newUrlList = [];

    for (var i = 0; i < 9; i++) {
      var grey = "_grey";
      if (i === newVal) {
        grey = "";
      }
      imgUrl = '/images/confidence/confidence_' + i + grey + '.png';
      newUrlList.push(imgUrl)
    }

    this.setState({
      confidenceImgUrlList: newUrlList
    })
  }

  setEmotionForms() {

    this.formList = [];

    this.emList = ['happy', 'sad', 'excited', 'angry']

    for (let j = 0; j < 4; j++) {
      let emotion = this.emList[j]
      this.formList.push((
        <div>
        <h3>{emotion}:    </h3>
          <img src={this.state.emotionImgUrlList[emotion+0]} style={{width: 50, height: 50}} onClick={() => this.onEmotionGoalChange(emotion, 0)} />
          <span> ----------- </span>
          <img src={this.state.emotionImgUrlList[emotion+1]} style={{width: 50, height: 50}} onClick={() => this.onEmotionGoalChange(emotion, 1)} />
          <span> ----------- </span>
          <img src={this.state.emotionImgUrlList[emotion+2]} style={{width: 50, height: 50}} onClick={() => this.onEmotionGoalChange(emotion, 2)} />
          <span> ----------- </span>
          <img src={this.state.emotionImgUrlList[emotion+3]} style={{width: 50, height: 50}} onClick={() => this.onEmotionGoalChange(emotion, 3)} />
        </div>
      ))
    }
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

  setEmotionValue(emotionType, value) {
    this.props.setEmotionGoal(this.getEmotionNoun(emotionType), value);
    // TODO: set the emotion value to the Lesson.jsx state
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
