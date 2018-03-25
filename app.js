const google = require('./google');
const lt = require('./language-tool.js')
const phrases = require('./phrases');

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
	grammar = await lt.checkGrammar(data.sent);
	data.grammar = grammar;
	data.sent = data.sent.toLowerCase();
	analysis = await google.analyze(data.sent)
	data.analysis = analysis;
	data = parse_intent(data);
	gen_intent(data);
	gen_response(data);
	return data;
}

function gen_intent(data){
	if (data.user_int.length == 0 && data.sys_int.length == 0){
		data.sys_int.push(system_intents[0]);
		data.sys_int.push(system_intents[1]);
	} else if (data.user_int.length > 0 && data.sys_int.length == 0) {
		data.sys_int = JSON.parse(JSON.stringify(data.user_int)); //provides a deep copy of everything in the array
	} else {
		for (topic of data.user_int){
			if(!data.completed_intents.includes(topic)){
				data.sys_int.push(topic);
				break;
			}
		}
	}
  return data;
}

function gen_response(data){
	resp = ''
	resp += answer_user(data.user_int).toString();
  for (topic of data.sys_int){
    data.completed_intents.push(topic)
    resp+=(topic + " ");
  }
  return(resp);

}

function answer_user(user_int){
	var answer = []
	for(intent of user_int){
		if(intent != 'GREET'){
			answer.push(intent + '_ANSWER, ')
		}//create response
	}
  return answer;
}

function parse_intent(data){
	if(!data.completed_intents.includes('GREET')){
		for (i = 0; i < greetings.length; i++){
			if(data.sent.includes(greetings[i])){
				data.formality = i;
				data.user_int.push('GREET');
				break;
			}
		}
	}
  return data;
}

function createData(sent) {
	return {
		sent,
		sys_int: [],
		user_int: [],
		completed_intents: [],
		formality: 0
	}
}

// data = {
//   sent: 'Quel âge avez-vous',
//   sys_int: [],
//   user_int: [],
//   completed_intents: [],
//   formality: 0
// }
//
// process(data).then((data2) => {
//   console.log(data2)
// });


module.exports.createData = createData;
module.exports.process = process;
module.exports.process2 = process2;
