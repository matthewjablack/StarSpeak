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

  dataExists(){
    let countEmpty;
    for (let datum of this.data){
      if (datum.emotions == null) {
        countEmpty += 1;
      }
    }
    return countEmpty/this.data.length < 0.9
  }

  findByFrame(frame){
    this.data.filter(x => x.frame === frame);
  }
}
