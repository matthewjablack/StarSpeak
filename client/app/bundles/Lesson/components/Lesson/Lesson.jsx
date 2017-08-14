import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import browser from 'detect-browser';
import {isObjectEmpty} from './params';
import {getIndicoEmotions} from './indico-emotion';
import {parseWatson} from './watson-parse';
import {createSpeechstat, getGradeScore, calculatePace} from './speechstat';
import RenderIntro from './RenderIntro';
import RenderAdjust from './RenderAdjust';
import RenderDevelop from './RenderDevelop';
import RenderPreload from './RenderPreload';
import RenderRecord from './RenderRecord';
import RenderAnalyze from './RenderAnalyze';
import RenderResults from './RenderResults';
import RenderDemoExceeded from './RenderDemoExceeded';
import AlertContainer from 'react-alert';
import {watsonTone} from './watsonTone';
import {requestUserMedia, startRecord, stopRecord} from './Record';
import {handleLocalStream} from './LocalStt';
import {handleMicClick,getFinalAndLatestInterimResult} from './WatsonStt';
import $ from 'jquery';
import FacialEmotion from './FacialEmotion';
import FacialEmotionsContainer from './FacialEmotionsContainer';

const uuidV1 = require('uuid/v1'); // eslint-disable-line

var screenshots = [];
var screenCount = 0;
var uuid = uuidV1();
var detector;

export default class Lesson extends Component{
  static get propTypes() {
    return {
      mode: PropTypes.string.isRequired,
      lesson: PropTypes.string,
      level: PropTypes.string,
      user: PropTypes.string,
      moduler: PropTypes.string,
    };
  }

  get alertOptions() {
    return {
      offset: 14,
      position: 'top right',
      theme: 'light',
      time: 5000,
      transition: 'scale'
    };
  }

  showAlert(type, txt) {
    this.msg.show(txt, {
      time: 200000,
      type: type,
    });
  }

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
        stt: '',
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
        stt: '',
        sttInterim: [''],
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
      mode: this.props.mode,
      umCount: 0,
      gradeScore: 0,
      affectivaLoaded: false,
      affectiva: {
        faces: 0,
        appearance: {},
        emotions: {},
        expressions: {},
        emojis: {},
      },
      facialEmotionsContainer: null,
      emotionGoals: {
        happiness: 0,
        sadness: 0,
        excitement: 0,
        anger: 0,
      }
    };


    this.setEmotionGoal = this.setEmotionGoal.bind(this);
    this.fetchToken = this.fetchToken.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.startStageAdjust = this.startStageAdjust.bind(this);
    this.startStageDevelop = this.startStageDevelop.bind(this);
    this.startStagePreload = this.startStagePreload.bind(this);
    this.startStageRecord = this.startStageRecord.bind(this);
    this.startStageAnalyze = this.startStageAnalyze.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.updatePresentCount = this.updatePresentCount.bind(this);
    this.setPresentCount = this.setPresentCount.bind(this);
    this.collectEmotions = this.collectEmotions.bind(this);
    this.setRefreshIntervalId = this.setRefreshIntervalId.bind(this);
  }

  componentWillMount() {
    var _this = this;

    var divRoot = $("#affdex_elements")[0];
    var width = 640;
    var height = 480;
    var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

    detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

    detector.detectAllEmotions();
    detector.detectAllExpressions();
    detector.detectAllEmojis();
    detector.detectAllAppearance();

    this.onStart();

    detector.addEventListener("onWebcamConnectSuccess", function() {
      console.log("I was able to connect to the camera successfully.");
    });

    detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
      _this.setState({affectivaLoaded: true});
      if (faces.length > 0) {
        _this.setState({
          affectiva: {
            faces: faces.length,
            appearance: faces[0].appearance,
            emotions: faces[0].emotions,
            expressions: faces[0].expressions,
            emojis: faces[0].emojis
          }
        })
      } else {
        _this.setState({affectiva: {faces: faces.length, appearance: null, emotions: null, expressions: null, emojis: null} });
      }
    });
  }

  async componentDidMount() {
    this.fetchToken();
    requestUserMedia();
    this.setPresentCount();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    this.setRefreshIntervalId();
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
      this.showAlert(type,txt);
    }
  }

  createAlert(type, txt) {
    if (!this.state.alerts.includes(txt)) {
      let newAlerts = this.state.alerts;
      newAlerts[newAlerts.length] = txt;
      this.setState({alerts: newAlerts});
      this.showAlert(type,txt);
    }
  }

  setPresentCount() {
    if (this.state.lesson && !isObjectEmpty(this.state.lesson)) {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Please download the latest version of Google Chrome');
        history.go(-1);
      }
      this.setState({presentCount: this.state.lesson.length, length: this.state.lesson.length, 
        linkback: '/' + this.props.level.id + '/' + this.props.moduler.id + '/lessons'});
    } else {
      this.setState({presentCount: 20, length: 20, linkback: ''});
    }
  }

  setEmotionGoal(emotion, value) {
    console.log(emotion+" "+value)
    console.log(emotion+" "+value)
    console.log(emotion+" "+value)
    console.log(emotion+" "+value)
    console.log(emotion+" "+value)
    console.log(emotion+" "+value)
    console.log(emotion+" "+value)
    let newEmotionGoals = Object.assign({}, this.state.emotionGoals)
    newEmotionGoals[emotion] = value;
    this.setState({
      emotionGoals: newEmotionGoals
    })

  }

  setRefreshIntervalId() {
    var _this = this;
    var interval = 1000;
    var expected = Date.now() + interval;
    setTimeout(step, interval);
    function step() {
        var dt = Date.now() - expected;
        if (dt > interval) {
          _this.createError('error', 'We detected a bug in your browser. Perhaps the browser tab was inactive?');
        }

        if (_this.state.loadCount === 0) {
          if (_this.state.stage == 'Adjust') {
            let screenshot = _this.refs.webcam.getScreenshot();
            if (_this.refs.webcam && screenshot === null) {
              _this.createError('error', 'Looks like your Webcam isn\'t turned on.');
            } else {
              _this.createAlert('success', 'Webcam loaded successfully');
            }
          }
        } else {
          _this.setState({ loadCount: _this.state.loadCount - 1 });
        }

        if (_this.state.stage == 'Record' && _this.state.presentCount > 0) {
          _this.setState({ presentCount: _this.state.presentCount - 1 });
          if (((_this.state.length - _this.state.presentCount) === 5) && _this.state.local.sttInterim[0] === '') {
            _this.createError('error', 'We aren\'t picking up any words from your presentation. Double check that your microphone is working properly ');
          }
        } else if (_this.state.stage == 'Record' && _this.state.presentCount == 0) {
          _this.startStageAnalyze();
          handleMicClick(_this);
        }

        if (_this.state.presentCount % 2 == 0 && _this.state.stage == 'Record') {
          try {
            let screenshot = _this.refs.webcam.getScreenshot();
            if (screenshot === null) {
              _this.createError('error', 'Error using webcam. Make sure it\'s turned on');
            }
            screenshots[screenCount] = screenshot;
            screenCount += 1;
          } catch(error) {
            _this.createError('error', 'Error using webcam. Make sure it\'s turned on');
          }
        }

        expected += interval;
        setTimeout(step, Math.max(0, interval - dt)); // take into account drift
    }
  }

  collectEmotions() {
    var _this = this;
    var facialEmotionsContainer = new FacialEmotionsContainer();
    var newCounter = 0;
    var interval = 50; // ms
    var expected = Date.now() + interval;
    setTimeout(step, interval);
    function step() {
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
          _this.createError('error', 'We detected a bug in your browser. Perhaps the browser tab was inactive?');
        }

        var aff = _this.state.affectiva;
        var facialEmotion = new FacialEmotion(aff.faces, aff.appearance, aff.emotions, aff.expressions, aff.emojis, newCounter);
        facialEmotionsContainer.addFacialEmotion(facialEmotion);

        if (_this.state.stage == 'Record') {
          newCounter += 1;
        } else {
          _this.setState({facialEmotionsContainer: facialEmotionsContainer});
          return
        }

        expected += interval;
        setTimeout(step, Math.max(0, interval - dt)); // take into account drift
    }
  }

  fetchToken() {
    return fetch('https://view.starspeak.io/api/token').then(res => {
      if (res.status != 200) {
        throw new Error('Error retrieving auth token');
      }
      return res.text();
    }).
    then(token => this.setState({token})).catch(this.handleError);
  }

  updatePresentCount(num) {
    this.setState({presentCount: parseInt(num)});
    this.setState({length: parseInt(num)});
  }

  onStart() {
    if (detector && !detector.isRunning) {
      detector.start();
    }
  }

  onStop() {
    if (detector && detector.isRunning) {
      detector.removeEventListener();
      detector.stop();
    }
  };

  onReset() {
    if (detector && detector.isRunning) {
      detector.reset();
    }
  };

  startStageAdjust() {
    this.setState({stage: 'Adjust'});
  }

  startStageDevelop() {
    this.setState({stage: 'Develop'});
  }

  startStagePreload() {
    this.setState({stage: 'Preload'})
  }

  startStageRecord() {
    startRecord(this);
    this.setState({stage: 'Record'});
    this.collectEmotions();
    handleMicClick(this);
    handleLocalStream(this);
  }

  async startStageAnalyze() {
    stopRecord(this, uuid);
    detector.stop();

    let newLocal = this.state.local;
    let newWatson = this.state.watson;
    newLocal.stt = newLocal.sttFinal.toString();

    try {
      if ((newLocal.sttFinal.length === 0) ||
      (newLocal.sttFinal[newLocal.sttFinal.length - 1].substring(0,8) !== newLocal.sttInterim.substring(0,8))) {
        newLocal.stt += newLocal.sttInterim;
      }
    } catch(error) {
      console.log(error); // eslint-disable-line
    }
    newWatson.stt = parseWatson(getFinalAndLatestInterimResult(this));
    newLocal.pace = calculatePace(newLocal.stt,  this.state.length - this.state.presentCount);
    newWatson.pace = calculatePace(newWatson.stt,  this.state.length - this.state.presentCount);

    let gradeScore = await getGradeScore(newLocal.stt, this.state.length - this.state.presentCount);

    this.setState({gradeScore: gradeScore});

    let WatsonTone = await watsonTone(this.state.user, newLocal.stt, this.state.mode);

    newWatson.tone = WatsonTone;

    this.setState({analyzing: true, local: newLocal, watson: newWatson, stage: 'Analyze', length: this.state.length - this.state.presentCount});
    handleMicClick(this);

    let indico = await getIndicoEmotions(screenshots, this.state.local.stt, this);

    this.setState({indico: indico, stage: 'Results'});

    let speechstat = createSpeechstat(this.state.user, this.state.lesson, this.state.moduler,
      this.state.indico, this.state.watson, this.state.local, browser, uuid, this.state.mode,
      this.facialEmotionsContainer);

    try {
      let reUm = / um ?/g;
      let umCount = this.state.watson.stt.match(reUm).length;
      this.setState({umCount: umCount});
    } catch(error) {
      console.log(error); // eslint-disable-line
    }

    this.setState({speechstat: speechstat});

    for (var i = 0; i < indico.errors.length; i++) {
      this.createError('error', indico.errors[i]);
    }

    for (var j = 0; j < WatsonTone.errors.length; j++) {
      this.createError('error', WatsonTone.errors[j]);
    }
  }

  render() {
    let lessonContent;
    if (this.state.stage === 'Intro') {
      lessonContent = <RenderIntro startStageAdjust={this.startStageAdjust} />;
    } else if (this.state.stage === 'Adjust') {
      lessonContent = <RenderAdjust startStageDevelop={this.startStageDevelop} width={this.state.width} mode={this.state.mode} updatePresentCount={(x) => this.updatePresentCount(x)} presentCount={this.state.presentCount} />;
    } else if (this.state.stage === 'Develop') {
      lessonContent = <RenderDevelop startStageRecord={this.startStageRecord} startStagePreload={this.startStagePreload} width={this.state.width} lesson={this.state.lesson} mode={this.state.mode} affectivaLoaded={this.state.affectivaLoaded} />;
    } else if (this.state.stage === 'Preload'){
      lessonContent = <RenderPreload startStageRecord={this.startStageRecord} affectivaLoaded={this.state.affectivaLoaded} setEmotionGoal={this.setEmotionGoal} />
    } else if (this.state.stage === 'Record') {
      lessonContent = <RenderRecord startStageAnalyze={this.startStageAnalyze} width={this.state.width} presentCount={this.state.presentCount} stt={this.state.local.sttInterim} />;
    } else if (this.state.stage == 'Analyze') {
      lessonContent = <RenderAnalyze local={this.state.local} watson={this.state.watson} stage={this.state.stage} indico={this.state.indico} linkback={this.state.linkback} percentage={this.state.percentage} percentUploaded={this.state.percentUploaded} user={this.state.user} mode={this.state.mode} umCount={this.state.umCount} gradeScore={this.state.gradeScore} />;
    } else if (this.state.stage == 'Results') {
      lessonContent = <RenderResults local={this.state.local} watson={this.state.watson} stage={this.state.stage} indico={this.state.indico} linkback={this.state.linkback} percentage={this.state.percentage} user={this.state.user} screenshot={screenshots[screenshots.length - 1]} mode={this.state.mode} umCount={this.state.umCount} gradeScore={this.state.gradeScore} />;
    } else if (this.state.stage == 'DemoLimitExceeded') {
      lessonContent = <RenderDemoExceeded/>;
    }

    let commonContent;
    if (this.state.stage !== 'Analyze' && this.state.stage !== 'Results' && this.state.stage !== 'DemoLimitExceeded') {
      commonContent = (
        <div>
          <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.state.width} height={this.state.width * 0.75} />
        </div>
      );
    }

    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        {lessonContent}
        {commonContent}
      </div>
    );
  }
}
