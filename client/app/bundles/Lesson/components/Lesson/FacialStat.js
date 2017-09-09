export default class FacialStat {
  constructor(faces, appearances, emotions, expressions, emojis, frame){
    this.faces = faces;
    this.appearances = appearances;
    this.emotions = emotions;
    this.expressions = expressions;
    this.emojis = emojis;
    this.frame = frame;
  }

  formatEmotions() {
    if (this.emotions != null) {
      return {
        joy: Math.round(this.emotions.joy), 
        sadness: Math.round(this.emotions.sadness), 
        excitement: Math.round(this.emotions.surprise),
        anger: Math.round(this.emotions.anger)
      };
    } else {
      return {joy: 0, sadness: 0, excitement: 0, anger: 0};
    }
  }
}
