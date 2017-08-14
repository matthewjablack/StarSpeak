export default class FacialEmotionsContainer {
  constructor(){
    this.data = [];
  }

  addFacialEmotion(facialEmotion){
    this.data.push(facialEmotion);
  }
}
