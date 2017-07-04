import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import browser from 'detect-browser';
import {isObjectEmpty} from './params';
import {getIndicoEmotions} from './indico-emotion';
import {parseWatson} from './watson-parse';
import {createSpeechstat, checkIpSession, calculatePace} from './speechstat';
import RenderIntro from './RenderIntro';
import RenderAdjust from './RenderAdjust';
import RenderDevelop from './RenderDevelop';
import RenderRecord from './RenderRecord';
import RenderAnalyze from './RenderAnalyze';
import RenderResults from './RenderResults';
import RenderDemoExceeded from './RenderDemoExceeded';
import AlertContainer from 'react-alert';
import {watsonTone} from './watsonTone';
import {requestUserMedia, startRecord, stopRecord} from './Record';
import {handleLocalStream} from './LocalStt';
import {handleMicClick,getFinalAndLatestInterimResult} from './WatsonStt';

const uuidV1 = require('uuid/v1');

var screenshots = [];
var screenCount = 0;
var errors = [];
var recorder;
var mediaStream = null;
var recordVideo;
var src;
var uuid = uuidV1();

export default class Lesson extends Component{
  static propTypes = {
    mode: PropTypes.string.isRequired,
  };

  alertOptions = {
    offset: 14,
    position: 'top right',
    theme: 'light',
    time: 5000,
    transition: 'scale'
  };

  showAlert = (type, txt) => {
    this.msg.show(txt, {
      time: 200000,
      type: type,
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      model: 'en-US_BroadbandModel',
      rawMessages: [],
      formattedMessages: [],
      audioSource: null,
      speakerLabels: false,
      settingsAtStreamStart: {
        model: '',
        keywords: [],
        speakerLabels: false
      },
      error: null,
      stage: 'Adjust',
      count1: 2,
      presentCount: 20,
      loadCount: 3,
      indico: {
        facialEmotion: {
          happy: 0.00,
          sad: 0.00,
          angry: 0.00,
          fear: 0.00,
          surprise: 0.00,
          neutral: 0.00,
          eCount: 0,
        },
        speechEmotion: {
          happy: 0.00,
          sad: 0.00,
          angry: 0.00,
          fear: 0.00,
          surprise: 0.00,
        },
        personality: {
          agreeableness: 0.00,
          conscientiousness: 0.00,
          extraversion: 0.00,
          openness: 0.00,
        },
        confidence: 0.00,
      },
      watson: {
        stt: "",
        pace: 0.00,
        tone: {
          emotion: {
            anger: 0.00,
            disgust: 0.00,
            fear: 0.00,
            joy: 0.00,
            sadness: 0.00,
          },
          language: {
            analytical: 0.00,
            confident: 0.00,
            tentative: 0.00,
          },
          social: {
            openness: 0.00,
            conscientiousness: 0.00,
            extraversion: 0.00,
            agreeableness: 0.00,
            emotionalRange: 0.00,
          },
          errors: [],
        }
      },
      local: {
        stt: "",
        sttInterim: [""],
        sttFinal: [],
        pace: 0.00,
      },
      screenshot: [],
      analyzing: false,
      width: '0',
      height: '0',
      length: 20,
      prep: 10,
      lesson: this.props.lesson,
      moduler: this.props.moduler,
      level: this.props.level,
      user: this.props.user,
      errors: [],
      alerts: [],
      percentage: 0.00,
      intervalId: 0,
      stream: null,
<<<<<<< HEAD
      mode: this.props.mode
=======
      umCount: 0
>>>>>>> finish basic watson hesitation
    };

    this.fetchToken = this.fetchToken.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.startStageAdjust = this.startStageAdjust.bind(this);
    this.startStageDevelop = this.startStageDevelop.bind(this);
    this.startStageRecord = this.startStageRecord.bind(this);
    this.startStageAnalyze = this.startStageAnalyze.bind(this);
    this.showAlert = this.showAlert.bind(this);
  }

  async componentDidMount() {
    this.fetchToken();
    requestUserMedia();

    if (this.state.lesson && !isObjectEmpty(this.state.lesson)) {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Please download the latest version of Google Chrome");
        history.go(-1);
      }
      this.setState({presentCount: this.state.lesson.length, length: this.state.lesson.length, 
        linkback: '/' + this.props.level.id + '/' + this.props.moduler.id + '/lessons'})
    } else {
      this.setState({presentCount: 20, length: 20, linkback: ''})
    }

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));

    let checkIpSessionResult = await checkIpSession();

    console.log(checkIpSessionResult);

    if (!checkIpSessionResult && this.state.mode == "StarLight") {
      this.setState({stage: 'DemoLimitExceeded'})
    }

    var refreshIntervalId = setInterval(() => {
      console.log(this.state.rawMessages);
      console.log(this.state.formattedMessages);
      console.log(this.state.formattedMessages[this.state.formattedMessages.length - 1].results[0].alternatives[0].transcript);
      if (this.state.loadCount === 0) {
        if (this.state.stage == 'Adjust') {
          let screenshot = this.refs.webcam.getScreenshot();
          if (this.refs.webcam && screenshot === null) {
            this.createError('error', "Looks like your Webcam isn't turned on.");
          } else {
            this.createAlert('success', "Webcam loaded successfully");
          }
        }
      } else {
        this.setState({ loadCount: this.state.loadCount - 1 });
      }


      if (this.state.stage == 'Record' && this.state.presentCount > 0) {
        this.setState({ presentCount: this.state.presentCount - 1 });
        if (((this.state.length - this.state.presentCount) === 5) && this.state.local.sttInterim[0] === "") {
          this.createError('error', "We aren't picking up any words from your presentation. Double check that your microphone is working properly ");
        }
      } else if (this.state.stage == 'Record' && this.state.presentCount == 0) {
        this.startStageAnalyze();
        handleMicClick(this);
      }

      if (this.state.presentCount % 2 == 0 && this.state.stage == 'Record') {
        try {
          let screenshot = this.refs.webcam.getScreenshot();
          if (screenshot === null) {
            this.createError('error', "Error using webcam. Make sure it's turned on");
          }
          screenshots[screenCount] = screenshot;
          screenCount += 1;
        } catch(error) {
          this.createError('error', "Error using webcam. Make sure it's turned on");
        }

      }
    }, 1000)

    this.setState({intervalId: refreshIntervalId})
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
    clearInterval(this.state.intervalId);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  createError(type, txt) {
    if (!this.state.errors.includes(txt)) {
      let newErrors = this.state.errors;
      newErrors[newErrors.length] = txt;
      this.setState({errors: newErrors});
      // errors[errors.length] = txt;
      this.showAlert(type,txt);
    }
  }

  createAlert(type, txt) {
    if (!this.state.alerts.includes(txt)) {
      let newAlerts = this.state.alerts;
      newAlerts[newAlerts.length] = txt;
      this.setState({alerts: newAlerts});
      // errors[errors.length] = txt;
      this.showAlert(type,txt);
    }
  }

  fetchToken() {
    return fetch('https://view.starspeak.io/api/token').then(res => {
      if (res.status != 200) {
        throw new Error('Error retrieving auth token');
      }
      return res.text();
    }). // todo: throw here if non-200 status
    then(token => this.setState({token})).catch(this.handleError);
  }



  async startStageAdjust() {
    this.setState({stage: 'Adjust'});
  }

  startStageDevelop() {
    this.setState({stage: 'Develop'});
  }

  startStageRecord() {
    startRecord(this);
    this.setState({stage: 'Record'});
    handleMicClick(this);
    handleLocalStream(this);
  }

  async startStageAnalyze() {
    stopRecord(this, uuid);

    let newLocal = this.state.local;
    let newWatson = this.state.watson;
    newLocal.stt = newLocal.sttFinal.toString();

    try {
      if ((newLocal.sttFinal.length === 0) ||
      (newLocal.sttFinal[newLocal.sttFinal.length - 1].substring(0,8) !== newLocal.sttInterim.substring(0,8))) {
        newLocal.stt += newLocal.sttInterim;
      }
    } catch(error) {
      console.log(error);
    }
    newWatson.stt = parseWatson(getFinalAndLatestInterimResult(this));
    newLocal.pace = calculatePace(newLocal.stt,  this.state.length - this.state.presentCount);
    newWatson.pace = calculatePace(newWatson.stt,  this.state.length - this.state.presentCount);

    let WatsonTone = await watsonTone(this.state.user, newLocal.stt, this.state.mode);

    newWatson.tone = WatsonTone;

    this.setState({analyzing: true, local: newLocal, watson: newWatson, stage: 'Analyze', length: this.state.length - this.state.presentCount});
    handleMicClick(this);

    let indico = await getIndicoEmotions(screenshots, this.state.local.stt, this);

    this.setState({indico: indico, stage: 'Results'});

    let speechstat = createSpeechstat(this.state.user, this.state.lesson, this.state.moduler,
      this.state.indico, this.state.watson, this.state.local, browser, uuid, this.state.mode);

    try {
      let reUm = / um ?/g;
      let umCount = this.state.watson.stt.match(reUm).length;
      this.setState({umCount: umCount})
    } catch(error) {
      console.log(error);
    }

    this.setState({speechstat: speechstat});

    for (var i = 0; i < indico.errors.length; i++) {
      this.createError('error', indico.errors[i]);
    }

    for (var i = 0; i < WatsonTone.errors.length; i++) {
      this.createError('error', WatsonTone.errors[i]);
    }
  }

  render() {
    let lessonContent;
    if (this.state.stage === 'Intro') {
      lessonContent = <RenderIntro startStageAdjust={this.startStageAdjust} />;
    } else if (this.state.stage === 'Adjust') {
      lessonContent = <RenderAdjust startStageDevelop={this.startStageDevelop} width={this.state.width} />;
    } else if (this.state.stage === 'Develop') {
      lessonContent = <RenderDevelop startStageRecord={this.startStageRecord} width={this.state.width} lesson={this.state.lesson} mode={this.state.mode} />;
    } else if (this.state.stage === 'Record') {
      lessonContent = <RenderRecord startStageAnalyze={this.startStageAnalyze} width={this.state.width} presentCount={this.state.presentCount} stt={this.state.local.sttInterim} />;
    } else if (this.state.stage == 'Analyze') {
      lessonContent = <RenderAnalyze local={this.state.local} watson={this.state.watson} stage={this.state.stage} indico={this.state.indico} linkback={this.state.linkback} percentage={this.state.percentage} percentUploaded={this.state.percentUploaded} user={this.state.user} mode={this.state.mode} />;
    } else if (this.state.stage == 'Results') {
      lessonContent = <RenderResults local={this.state.local} watson={this.state.watson} stage={this.state.stage} indico={this.state.indico} linkback={this.state.linkback} percentage={this.state.percentage} user={this.state.user} screenshot={screenshots[screenshots.length - 1]} mode={this.state.mode}/>;
    } else if (this.state.stage == 'DemoLimitExceeded') {
      lessonContent = <RenderDemoExceeded/>;
    }

    let commonContent;
    if (this.state.stage !== 'Analyze' && this.state.stage !== 'Results' && this.state.stage !== 'DemoLimitExceeded') {
      commonContent = (
        <div>
          <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.state.width} height={this.state.width * 0.75} />
        </div>
      )
    }

    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        {lessonContent}
        {commonContent}
      </div>
    )
  }
}
