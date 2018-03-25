const stringSim = require('string-similarity');
const phrases = require('./phrases');

var compare = sent => {
  var score = 0;
  var type = '';
  sents = phrases.phrases;
  for(var [key, value] of Object.entries(sents)){
    var temp = stringSim.compareTwoStrings(sent, key);
    console.log(key, value, temp);
    if(temp > score){
      score = temp;
      type = value;
    }
  }
  return type;
  //anything greater than 0.45?
}

console.log(compare("Qui es-tu et d'où est-ce que tu viens?"));
