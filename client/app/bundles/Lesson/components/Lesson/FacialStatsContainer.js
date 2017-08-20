export default class FacialStatsContainer {
  constructor(){
    this.data = [];
  }

  addFacialStat(facialStat){
    this.data.push(facialStat);
  }

  emotionsData(){
    let array = [];
    for (let datum of this.data) {
      array.push(datum.formatEmotions());
    }
    return array;
  }
}
