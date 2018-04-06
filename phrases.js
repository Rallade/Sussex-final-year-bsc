var user_intents = ['GREET', 'NAME', 'FEELING', 'AGE', 'OCCUPATION', 'ORIGINS', 'BYE'];

var phrases = {
  'NAME':[
    "Je m'appelle",
    "Je suis"
  ],
  'NAME_QUESTION': [
    'Comment vous appelez-vous',
    'Qui êtes-vous',
    'Comment t\'appelles-tu?',
    'Qui est-tu?'
    //'Comment est-ce que vous vous appelez',
  ],
  'FEELING': [
    'Je me sens',
    'Je vais'
  ],
  'FEELING_QUESTION': [
    'Comment allez-vous?',
    'Comment vas-tu?',
    'ça va?'
  ],
  'AGE': [
    "J'ai  ans"
  ],
  'AGE_QUESTION': [
    'Quel âge avez-vous',
    'Quel est votre âge',
    'Quel âge as-tu',
    'Quel est ton âge'
  ],
  'OCCUPATION': [
    "Je suis un",
    "Je suis une"
  ],
  'OCCUPATION_QUESTION': [
    'Que faites-vous dans la vie',
    'Quel est votre emploi',
    'Où travaillez-vous',
    'Que fais-tu dans la vie',
    'Quel est ton emploi',
    'Où travailles-tu',
    "Quel est votre métier?",
    "Quel est ton métier?",
    "Quel est votre profession?",
    "Quel est ton profession?"
  ],
  'ORIGINS': [
    "Je viens de la",
    "Je viens du",
    "J'ai grandi au",
    "J'ai grandi en",
    "Je suis de la",
    "Je suis"
  ],
  'ORIGINS_QUESTION': [
    "D'où venez-vous",
    "Où étiez-vous né",
    "Où avez-vous grandi",
    "Quelle est votre ville natale",
    "D'où viens-tu"
  ],
  'BYE': [
    'Au revoir',
    'À la prochaine',
    'À plus'
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
