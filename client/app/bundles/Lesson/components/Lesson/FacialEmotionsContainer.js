export default class FacialEmotionsContainer {
  constructor(){
	this.data = [];
  }

  addFacialEmotion(facialEmotion){
	this.data.push(facialEmotion);
  }

  getLatestFacialEmotion() {
	return this.data.get(this.data.length - 1);
  }
}
