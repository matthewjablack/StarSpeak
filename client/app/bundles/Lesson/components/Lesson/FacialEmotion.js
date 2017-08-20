export default class FacialEmotion {
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
        joy: this.emotions.joy, 
        sadness: this.emotions.sadness, 
        excitement: this.emotions.surprise,
        anger: this.emotions.anger
      };
    } else {
      return {joy: 0, sadness: 0, excitement: 0, anger: 0};
    }
  }
}
