export default class FacialEmotionsContainer {
  constructor(){
    this.data = [];
  }

  addFacialEmotion(facialEmotion){
    this.data.push(facialEmotion);
  }

  emotionsData(){
    let array = [];
    for (let datum of this.data) {
      array.push(datum.formatEmotions());
    }
    return array;
  }
}
