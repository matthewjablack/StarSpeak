import React, {Component} from 'react';
import PropTypes from 'prop-types';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import FontAwesome from 'react-fontawesome';
import Webcam from 'react-webcam';
import {formatSeconds} from './format-time';
import SpeechToText from 'speech-to-text';
import browser from 'detect-browser';
import {isObjectEmpty} from './params';
import {getIndicoEmotions} from './indico-emotion';
import {parseWatson} from './watson-parse';
import {createSpeechstat, calculatePace} from './speechstat';
import {Stats} from './stats';
import RenderIntro from './RenderIntro';
import RenderAdjust from './RenderAdjust';
import RenderDevelop from './RenderDevelop';
import RenderRecord from './RenderRecord';
import RenderAnalyze from './RenderAnalyze';
import RenderResults from './RenderResults';
import AlertContainer from 'react-alert';
import {watsonTone} from './watsonTone';
import RecordRTC from 'recordrtc';

const uuidV1 = require('uuid/v1');

var screenshots = [];
var screenCount = 0;
var errors = [];
var recorder;
var mediaStream = null;
var recordVideo;
var src;

export default class Lesson extends Component{
  static propTypes = {
    lesson: PropTypes.object.isRequired,
    moduler: PropTypes.object.isRequired,
    level: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
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
      linkback: '/' + this.props.level.id + '/' + this.props.moduler.id + '/lessons',
      errors: [],
      alerts: [],
      percentage: 0.00,
      intervalId: 0,
    };

    this.handleFormattedMessage = this.handleFormattedMessage.bind(this);
    this.handleRawdMessage = this.handleRawdMessage.bind(this);
    this.handleTranscriptEnd = this.handleTranscriptEnd.bind(this);
    this.handleMicClick = this.handleMicClick.bind(this);
    this.stopTranscription = this.stopTranscription.bind(this);
    this.fetchToken = this.fetchToken.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleLocalStream = this.handleLocalStream.bind(this);
    this.startStageAdjust = this.startStageAdjust.bind(this);
    this.startStageDevelop = this.startStageDevelop.bind(this);
    this.startStageRecord = this.startStageRecord.bind(this);
    this.startStageAnalyze = this.startStageAnalyze.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);

    // this.postFiles = this.postFiles.bind(this);
    // this.xhr = this.xhr.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleResourceCreated = this.handleResourceCreated.bind(this);
    // this.generateRandomString = this.generateRandomString.bind(this);
    this.captureUserMedia = this.captureUserMedia.bind(this);
    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
  }

  componentDidMount() {
    this.fetchToken();

    this.requestUserMedia();

    if (!isObjectEmpty(this.state.lesson)) {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Please download the latest version of Google Chrome");
        history.go(-1);
      }
      this.setState({presentCount: this.state.lesson.length, length: this.state.lesson.length})
    }

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));

    var refreshIntervalId = setInterval(() => {
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
        this.handleMicClick();
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






  captureUserMedia(callback) {  
    var params = { audio: true, video: true };
    navigator.getUserMedia(params, callback, (error) => {
      alert(JSON.stringify(error));
    });
  };


  requestUserMedia() {
    this.captureUserMedia((stream) => {
      src = window.URL.createObjectURL(stream);
      // this.setState({ src: window.URL.createObjectURL(stream) });
    });
  }


  startRecord() {
    this.captureUserMedia((stream) => {
      recordVideo = RecordRTC(stream, { type: 'video' });
      recordVideo.startRecording();
    });
  }

  stopRecord() {
    recordVideo.stopRecording(() => {
      var blob = recordVideo.getBlob();

      var fileName = uuidV1() + '.webm';

      var file = new File([blob], fileName, {
          type: 'video/webm'
      });

      this.setState({upload: {name: file.name, size: file.size, loaded: 0} } );

      FileStore.createResource(file, { onProgress: this.handleProgress })
      .then((data) => {
        this.handleResourceCreated(file, data.video);
      })
      .fail((xhr) => {
        this.handleError(file, xhr);
      });

      this.setState({ uploading: true });
    });
  }


  handleProgress(file, loaded) {
    var upload = this.state.upload;
    if (upload) { upload.loaded = loaded };

    let loader = this.state.upload.loaded;
    let size = this.state.upload.size;

    this.setState({
     percentUploaded: Math.round((loader) / (size) * 100)
    });
  }

  handleError(file, xhr) {
    this.setState({ errors: file.name + ' failed to upload'});
  }

  handleResourceCreated(file, video) {
    this.setState({video: video});
  }





  
















  reset() {
    if (this.state.audioSource) {
      this.stopTranscription();
    }
    this.setState({rawMessages: [], formattedMessages: [], error: null});
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

  captureSettings() {
    this.setState({
      settingsAtStreamStart: {
        model: this.state.model,
        keywords: [],
        speakerLabels: this.state.speakerLabels
      }
    });
  }

  stopTranscription() {
    this.stream && this.stream.stop();
    this.setState({audioSource: null});
  }

  getRecognizeOptions(extra) {
    return Object.assign({
      token: this.state.token, smart_formatting: true, // formats phone numbers, currency, etc. (server-side)
      format: true, // adds capitals, periods, and a few other things (client-side)
      model: this.state.model,
      objectMode: true,
      interim_results: true,
      continuous: true,
      word_alternatives_threshold: 0.01, // note: in normal usage, you'd probably set this a bit higher
      keywords: [],
      keywords_threshold: 0
        ? 0.01
        : undefined, // note: in normal usage, you'd probably set this a bit higher
      timestamps: true, // set timestamps for each word - automatically turned on by speaker_labels
      speaker_labels: this.state.speakerLabels, // includes the speaker_labels in separate objects unless resultsBySpeaker is enabled
      resultsBySpeaker: this.state.speakerLabels, // combines speaker_labels and results together into single objects, making for easier transcript outputting
      speakerlessInterim: this.state.speakerLabels // allow interim results through before the speaker has been determined
    }, extra);
  }

  handleMicClick() {
    if (this.state.audioSource === 'mic') {
      return this.stopTranscription();
    }
    this.reset();
    this.setState({audioSource: 'mic'});
    this.handleStream(recognizeMicrophone(this.getRecognizeOptions()));
  }

  handleLocalStream() {
    const onAnythingSaid = text => {
      if (this.state.stage == 'Record') {
        let newLocal = this.state.local;
        newLocal.sttInterim = text;
        this.setState({local: newLocal});
        console.log(`Interim text: ${text}`);
      }
    }
    const onFinalised = text => {
      if (this.state.stage == 'Record') {
        let newLocal = this.state.local;
        newLocal.sttFinal[newLocal.sttFinal.length] = text;
        this.setState({local: newLocal});
        console.log(`Finalised text: ${text}`);
      }
    }
    try {
      const listener = new SpeechToText(onAnythingSaid, onFinalised);
      listener.startListening();
    } catch (error) {
      console.log(error);
    }
  }

  handleStream(stream) {
    if (this.stream) {
      this.stream.stop();
      this.stream.removeAllListeners();
      this.stream.recognizeStream.removeAllListeners();
    }
    this.stream = stream;
    this.captureSettings();

    stream.on('data', this.handleFormattedMessage).on('end', this.handleTranscriptEnd).on('error', this.handleError);

    stream.recognizeStream.on('end', () => {
      if (this.state.error) {this.handleTranscriptEnd()};
    });

    stream.recognizeStream
      .on('message', (frame, json) => this.handleRawdMessage({sent: false, frame, json}))
      .on('send-json', json => this.handleRawdMessage({sent: true, json}))
      .once('send-data', () => this.handleRawdMessage({
        sent: true, binary: true, data: true // discard the binary data to avoid waisting memory
      }))
      .on('close', (code, message) => this.handleRawdMessage({close: true, code, message}));
  }

  handleRawdMessage(msg) {
    this.setState({rawMessages: this.state.rawMessages.concat(msg)});
  }

  handleFormattedMessage(msg) {
    this.setState({formattedMessages: this.state.formattedMessages.concat(msg)});
  }

  handleTranscriptEnd() {
    this.setState({audioSource: null})
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

  getFinalResults() {
    return this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final);
  }

  getCurrentInterimResult() {
    const r = this.state.formattedMessages[this.state.formattedMessages.length - 1];
    if (!r || !r.results || !r.results.length || r.results[0].final) {
      return null;
    }
    return r;
  }

  getFinalAndLatestInterimResult() {
    const final = this.getFinalResults();
    const interim = this.getCurrentInterimResult();
    if (interim) {
      final.push(interim);
    }
    return final;
  }

  handleError(err, extra) {
    try {
      if (err.name == 'UNRECOGNIZED_FORMAT') {
        err = 'Unable to determine content type from file header; only wav, flac, and ogg/opus are supported. Please choose a different file.';
      } else if (err.name === 'NotSupportedError' && this.state.audioSource === 'mic') {
        err = 'This browser does not support microphone input.';
      } else if (err.message === '(\'UpsamplingNotAllowed\', 8000, 16000)') {
        err = 'Please select a narrowband voice model to transcribe 8KHz audio files.';
      }
      this.setState({ error: err.message || err });
    } catch(error) {
      console.log(error);
    }
  }

  startStageAdjust() {
    this.setState({stage: 'Adjust'});
  }

  startStageDevelop() {
    this.setState({stage: 'Develop'});
  }

  startStageRecord() {
    this.startRecord();

    this.setState({stage: 'Record'});
    this.handleMicClick();
    this.handleLocalStream();
  }

  async startStageAnalyze() {
    this.stopRecord();

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
    newWatson.stt = parseWatson(this.getFinalAndLatestInterimResult());
    newLocal.pace = calculatePace(newLocal.stt,  this.state.length - this.state.presentCount);
    newWatson.pace = calculatePace(newWatson.stt,  this.state.length - this.state.presentCount);

    let WatsonTone = await watsonTone(this.state.user.auth_token, newLocal.stt);

    newWatson.tone = WatsonTone;

    this.setState({analyzing: true, local: newLocal, watson: newWatson, stage: 'Analyze', length: this.state.length - this.state.presentCount});
    this.handleMicClick();

    let indico = await getIndicoEmotions(screenshots, this.state.local.stt, this);

    this.setState({indico: indico, stage: 'Results'});

    let speechstat = createSpeechstat(this.state.user, this.state.lesson, this.state.moduler,
      this.state.indico, this.state.watson, this.state.local, browser, this.state.video);

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
      lessonContent = <RenderDevelop startStageRecord={this.startStageRecord} width={this.state.width} lesson={this.state.lesson} />;
    } else if (this.state.stage === 'Record') {
      lessonContent = <RenderRecord startStageAnalyze={this.startStageAnalyze} width={this.state.width} presentCount={this.state.presentCount} stt={this.state.local.sttInterim} />;
    } else if (this.state.stage == 'Analyze') {
      lessonContent = <RenderAnalyze local={this.state.local} watson={this.state.watson} stage={this.state.stage} indico={this.state.indico} linkback={this.state.linkback} percentage={this.state.percentage} percentUploaded={this.state.percentUploaded} />;
    } else {
      lessonContent = <RenderResults local={this.state.local} watson={this.state.watson} stage={this.state.stage} indico={this.state.indico} linkback={this.state.linkback} percentage={this.state.percentage} user={this.state.user} screenshot={screenshots[screenshots.length - 1]}/>;
    }

    let commonContent;
    if (this.state.stage !== 'Analyze' && this.state.stage !== 'Results') {
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
