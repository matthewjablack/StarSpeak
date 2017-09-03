import SpeechFrame from './SpeechFrame';

export default class SpeechFrameContainer {
  constructor(){
    this.data = [];
    this.stt = '';
    this.formattedData = [];
  }

  addSpeech(speechFrame){
    this.data.push(speechFrame);
  }

  addStt(stt){
    this.stt = stt + ' ';
  }

  formattedDataSpeech(){
    let array = [];
    for (let datum of this.formattedData){
      array.push(datum.text);
    }
    return array;
  }

  determineWordTiming(){
    let placeholderText = '';

    for (let datum of this.data) {
      let regexp = new RegExp("^(" + placeholderText + ")");
      let speechFrame = new SpeechFrame(datum.text.replace(regexp,"").trim(), datum.frame, datum.confidence);
      if (this.stt.startsWith(datum.text + ' ') && !this.formattedDataSpeech().includes(datum.text)
        && (speechFrame.text !== "") && (datum.text.length >= placeholderText.length)){
        placeholderText = datum.text
        this.formattedData.push(speechFrame);
      }
    }
  }
}