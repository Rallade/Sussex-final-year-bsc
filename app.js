const google = require('./google');
const lt = require('./language-tool')
const phrases = require('./phrases');
const stringSim = require('string-similarity');
const characters = require('./characters')

var greetings = ['bonjour', 'salut', 'coucou'];

var goodbyes = ['au revoir', 'salut' ,'à plus'];

var system_intents = ['GREET', 'NAME', 'AGE', 'OCCUPATION', 'ORIGINS', 'BYE'];

var completed_intents = [];

var user_intents = ['GREET', 'NAME', 'AGE', 'OCCUPATION', 'ORIGINS', 'BYE'];

var formality = 0; //0 being very formal

var user_details = {
	'NAME': null,
	'AGE': null,
	'OCCUPATION': null,
	'ORIGINS': null,
	'GENDER': null
}

var user_speaking = true;

var sys_int = [];
var user_int = [];


function process(data){
  data.sent = data.sent.toLowerCase();
	var a = google.analyze(data.sent)
  	.then(function(analysis) {
  		data.analysis = analysis;
  		data = parse_intent(data);
  		gen_intent(data);
  		gen_response(data);
  		return data;
  	}).catch((err) => {
  		console.log(err);
  	});
  return(a);
}

var process2 = async (data) => {
	if (data.completed_intents.length == 0){
		data.character = characters.names[Math.floor(Math.random() * (characters.names.length+1))];
		console.log(data.character, 'has been chosen');
	}
	grammar = await lt.checkGrammar(data.sent);
	data.grammar = grammar;
	data.sent = data.sent.toLowerCase();
	analysis = await google.analyze(data.sent)
	data.analysis = analysis;
	data = parse_intent(data);
	gen_intent(data);
	gen_response(data);
	createResponse(data)
 	// console.log(JSON.stringify(data, null, 4));
	return data;
}

function gen_intent(data){
	console.log('Generating intent');
	// if (data.user_int.length == 0 && data.sys_int.length == 0){
	// 	data.sys_int.push(system_intents[0]);
	// 	data.sys_int.push(system_intents[1]);
	// } else if (data.user_int.length > 0 && data.sys_int.length == 0 && !data.completed_intents.includes(topic)) {
	// 	data.sys_int = JSON.parse(JSON.stringify(data.user_int)); //provides a deep copy of everything in the array
	// } else {
	// 	for (topic of data.user_int){
	// 		if(!data.completed_intents.includes(topic)){
	// 			data.sys_int.push(topic);
	// 			break;
	// 		}
	// 	}
	// }
	for (topic of data.user_int){
		if(!data.completed_intents.includes(topic)){
			data.sys_int.push(topic);
		}
	}
	if((data.sys_int.length == 1 && data.sys_int[0] == 'GREET') || data.sys_int.length == 0){
		for (topic of system_intents){
			if(!data.completed_intents.includes(topic) && topic != 'GREET'){
				data.sys_int.push(topic);
				break;
			}
		}
	}
  return data;
}

function gen_response(data){
	console.log('Generating response');
	resp = ''
	resp += answer_user(data.user_int).join(' ') + ' ';
  for (topic of data.sys_int){
    data.completed_intents.push(topic)
    resp+=(topic + " ");
  }
	data.template_response = resp;
  return(data);

}

function answer_user(user_int){
	var answer = []
	for(intent of user_int){
		if(intent != 'GREET'){
			answer.push(intent + '_ANSWER')
		}//create response
	}
  return answer;
}

function parse_intent(data){
	console.log('Parsing intent')
	if(!data.completed_intents.includes('GREET')){
		for (i = 0; i < greetings.length; i++){
			if(data.sent.includes(greetings[i])){
				data.formality = i;
				data.user_int.push('GREET');
				data.sent = data.sent.replace(greetings[i], '');
				break;
			}
		}
	}
	var score = 0;
  var type = '';
  sents = phrases.phrases;
  for(var [key, value] of Object.entries(sents)){
    let temp = stringSim.compareTwoStrings(data.sent, key);
    if(temp > score && temp > 0){
      score = temp;
      type = value;
    }
  }
	if (type){
		data.user_int.push(type);
	}
  return data;
}

function createResponse(data){
	components = data.template_response.split(" ");
	response = "";
	for (component of components) {
		details = characters.details[data.character];
		if (component.slice(-7) == '_ANSWER'){
			topic = component.slice(0, -7);
			if (topic == 'NAME') {
				response += ("Je m'apelle " + details.name + ".");
			} else if (topic == 'OCCUPATION') {
				response += 'Je suis '
				if(details.gender == 'female'){
					response += ('une ' + details.occupation + ".");
				} else if (details.gender == 'male') {
					response += ('un ' + details.occupation + ".");
				}
			} else if(topic == 'AGE') {
				response += ("J'ai " + details.age + ' ans.');
			} else if (topic == 'ORIGINS'){
				if(details.origin == 'Luxembourg'){
					response += ('Je viens du ' + details.origin);
				} else {
					response += ('Je viens de ' + details.origin);
				}
				response += '.';
			}
			response += ' ';
		} else {
			if (component == 'NAME') {
				if(data.formality < 1){
					response += details.name_question_formal;
				} else {
					response += details.name_question_informal;
				}
			} else if (component == 'OCCUPATION') {
				if(data.formality < 1){
					response += details.occupation_question_formal;
				} else {
					response += details.occupation_question_informal;
				}
			} else if(component == 'AGE') {
				if(data.formality < 1){
					response += details.age_question_formal;
				} else {
					response += details.age_question_informal;
				}
			} else if (component == 'ORIGINS'){
				if(details.origin == 'Luxembourg'){
					response += details.origin_question_formal;
				} else {
					response += details.origin_question_informal;
				}
			} else if (component == 'GREET') {
				response += greetings[data.formality] + ' ';
			}
		}
	}
	data.response = response;
	return response;
}

function fillData(data) {
	if(data.completed_intents == undefined){
		data.completed_intents = [];
	}
	data.sys_int = [];
	data.user_int = [];
	data.grammar = [];
	data.analysis = [];
	data.response = [];
	return data;

}

// data = {
//   sent: 'Quel âge avez-vous',
//   sys_int: [],
//   user_int: [],
//   completed_intents: [],
//   formality: 0
// }
//
// process2(data).then((data2) => {
//   console.log(data2)
// });


module.exports.fillData = fillData;
module.exports.process = process;
module.exports.process2 = process2;
