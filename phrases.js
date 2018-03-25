const _ = require('lodash');

var user_intents = ['GREET', 'NAME', 'AGE', 'OCCUPATION', 'ORIGINS', 'BYE'];

var phrases = {
  'NAME': [
    'Comment vous appelez-vous',
    'Qui êtes-vous',
    'Comment t\'appelles-tu?',
    'Qui est-tu?'
    //'Comment est-ce que vous vous appelez',
  ],
  'AGE': [
    'Quel âge avez-vous',
    'Quel est votre âge',
    'Quel âge as-tu',
    'Quel est ton âge'
  ],
  'OCCUPATION': [
    'Que faites-vous dans la vie',
    'Quel est votre emploi',
    'Où travaillez-vous',
    'Que fais-tu dans la vie',
    'Quel est ton emploi',
    'Où travailles-tu'
  ],
  'ORIGINS': [
    "D'où venez-vous",
    "Où étiez-vous né",
    "Où avez-vous grandi",
    "Quelle est votre ville natale",
    "D'où viens-tu"
  ]
};

var invert = dict => {
  var inverse = {};
  for(var [key, value] of Object.entries(dict)){
    for(phrase of value){
      inverse[phrase] = key;
    }
  }
  return inverse;
}


module.exports.phrases = invert(phrases);

//I can't talk about BLANK
//But you can talk about....
