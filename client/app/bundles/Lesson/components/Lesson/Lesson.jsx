import React, {Component} from 'react';
import PropTypes from 'prop-types';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import FontAwesome from 'react-fontawesome';
import Webcam from 'react-webcam';
import { ProgressBar, Col, Row } from 'react-bootstrap';
import {formatSeconds} from './format-time';
import SpeechToText from 'speech-to-text';
import browser from 'detect-browser';
import {isObjectEmpty} from './params';
import {getIndicoEmotions} from './indico-emotion';
import {parseWatson} from './watson-parse';
import {Progress} from './progress';
import {createSpeechstat, calculatePace} from './speechstat';
import {Stats} from './stats';
import RenderIntro from './RenderIntro';
import RenderAdjust from './RenderAdjust';
import RenderDevelop from './RenderDevelop';
import RenderRecord from './RenderRecord';
import RenderAnalyze from './RenderAnalyze';
import RenderResults from './RenderResults';


var screenshots = [];
var screenCount = 0;


export default class Lesson extends Component{
  static propTypes = {
    lesson: PropTypes.object.isRequired,
    moduler: PropTypes.object.isRequired,
    level: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
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
      stage: 'Intro',
      count1: 2,
      presentCount: 20,
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
        sst: "",
        pace: 0.00,
      },
      local: {
        sst: "", 
        sstInterim: "", 
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
  }

  componentDidMount() {
    this.fetchToken();

    if (!isObjectEmpty(this.state.lesson)) {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Please download the latest version of Google Chrome");
        history.go(-1);
      }
      this.setState({stage: 'Adjust', presentCount: this.state.lesson.length, length: this.state.lesson.length})
    }

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));

    setInterval(() => {
      if (this.state.stage == 'Record' && this.state.presentCount > 0) {
        this.setState({ presentCount: this.state.presentCount - 1 });
      } else if (this.state.stage == 'Record' && this.state.presentCount == 0) {
        this.setState({stage: 'Analyze'});
        this.handleMicClick();
      }

      if (this.state.presentCount % 2 == 0 && this.state.stage == 'Record') {
        let screenshot = this.refs.webcam.getScreenshot();
        screenshots[screenCount] = screenshot;
        screenCount += 1;
      }

      if (this.state.analyzing == false && this.state.stage == 'Analyze') {
        this.startAnalyzing();
      }
    }, 1000)
    
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  reset() {
    if (this.state.audioSource) {
      this.stopTranscription();
    }
    this.setState({rawMessages: [], formattedMessages: [], error: null});
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
        newLocal.sstInterim = text;
        this.setState({local: newLocal});
        console.log(`Interim text: ${text}`);
      }
    }
    const onFinalised = text => {
      if (this.state.stage == 'Record') {
        let newLocal = this.state.local;
        newLocal.sst = text;
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
    console.error(err, extra);
    if (err.name == 'UNRECOGNIZED_FORMAT') {
      err = 'Unable to determine content type from file header; only wav, flac, and ogg/opus are supported. Please choose a different file.';
    } else if (err.name === 'NotSupportedError' && this.state.audioSource === 'mic') {
      err = 'This browser does not support microphone input.';
    } else if (err.message === '(\'UpsamplingNotAllowed\', 8000, 16000)') {
      err = 'Please select a narrowband voice model to transcribe 8KHz audio files.';
    }
    this.setState({ error: err.message || err });
  }

  startStageAdjust() {
    this.setState({stage: 'Adjust'});
  }

  startStageDevelop() {
    this.setState({stage: 'Develop'});
  }

  startStageRecord() {
    this.setState({stage: 'Record'});
    this.handleMicClick();
    this.handleLocalStream();
  }

  startStageAnalyze() {
    this.setState({stage: 'Analyze', length: this.state.length - this.state.presentCount});
    this.handleMicClick();
  }

  async startAnalyzing() {
    this.setState({analyzing: true});

    let newLocal = this.state.local;
    let newWatson = this.state.watson;
    if (newLocal.sst === "") { newLocal.sst = newLocal.sstInterim };
    newWatson.sst = parseWatson(this.getFinalAndLatestInterimResult());
    newLocal.pace = calculatePace(newLocal.sst, this.state.length);
    newWatson.pace = calculatePace(newWatson.sst, this.state.length); 

    this.setState({local: newLocal, watson: newWatson});

    let indico = await getIndicoEmotions(screenshots, newLocal.sst);
    
    this.setState({indico: indico, stage: 'Results'});

    createSpeechstat(this.state.user, this.state.lesson, this.state.moduler, 
      this.state.indico, this.state.watson, this.state.local, browser);
  }

  render() {
    if (this.state.stage === 'Intro') {
      return (
        <RenderIntro startStageAdjust={this.startStageAdjust} />
      );
    } else if (this.state.stage === 'Adjust') {
      return (
        <RenderAdjust startStageDevelop={this.startStageDevelop} width={this.state.width} />
      );
    } else if (this.state.stage === 'Develop') {
      return (
        <RenderDevelop startStageRecord={this.startStageRecord} width={this.state.width} lesson={this.state.lesson}  />
      );
    } else if (this.state.stage === 'Record') {
      return (
        <div>
          <div className="centerFixed">
            <h2>
              {(this.state.presentCount % 2) == 0 ?  
              <FontAwesome
                className='super-crazy-colors'
                name='circle'
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',   display: 'none', position: 'fixed', top: '78px', marginLeft: '-25px' }}
              /> :  
              <FontAwesome
                className='super-crazy-colors'
                name='circle'
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#e74c3c', fontSize: '20px', position: 'fixed', top: '78px', marginLeft: '-25px' }}
              /> }
              {formatSeconds(this.state.presentCount)}
              <button className="whiteBtnSpace" onClick={this.startStageAnalyze}>Stop</button>
            </h2>
          </div>
          <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.state.width} height={this.state.width * 0.75} ref='webcam'/>
        </div>
        // <RenderRecord startStageAnalyze={this.startStageAnalyze} width={this.state.width} presentCount={this.state.presentCount} />
      );
    } else if (this.state.stage == 'Analyze') {
      return (
        <RenderAnalyze local={this.state.local} stage={this.state.stage} indico={this.state.indico} linkback={this.state.linkback} />
      );
    } else {
      return (
        <RenderResults local={this.state.local} stage={this.state.stage} indico={this.state.indico} linkback={this.state.linkback} />
      );
    } 
  }
}

