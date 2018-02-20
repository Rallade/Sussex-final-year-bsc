class Intent {
	constructor(name){
		this.name = name;
	}
}

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

function process(sent){
	console.log(`processing ${sent}`)
	if (user_speaking){
		parse_intent(sent.toLowerCase());
	}
	user_speaking = false;
	user_int = ['GREET', 'NAME']; //for testing purposes
	if(!user_speaking){
		gen_intent();
		console.log(`User: ${user_int}`);
		console.log(`System: ${sys_int}`);
		console.log(`Response ${gen_response()}`);
	}

}

function gen_intent(){
	if (user_int.length == 0 && sys_int.length == 0){
		sys_int.push(system_intents[0]);
		sys_int.push(system_intents[1]);
	} else if (user_int.length > 0 && sys_int.length == 0) {
		sys_int = JSON.parse(JSON.stringify(user_int)); //provides a deep copy of everything in the array
	} else {
		for (topic of user_int){
			if(!completed_intents.includes(topic)){
				sys_int.push(topic);
				break;
			}
		}
	}
}

function gen_response(){
	resp = ''
	console.log(sys_int);
	//resp += answer_user().toString();
	resp += answer_user().toString();
	for (topic of sys_int){
		console.log(topic);
		completed_intents.push(topic)
		resp+=(topic + " ");
	}
	return(resp);
}

function answer_user(){
	var answer = []
	for(intent of user_int){
		if(intent != 'GREET'){
			answer.push(intent + '_ANSWER, ')
		}//create response
	}

	return answer;
}

function parse_intent(sent){
	if(!completed_intents.includes('GREET')){
		for (i = 0; i < greetings.length; i++){
			if(sent.includes(greetings[0])){
				formality = i;
				user_int.push('GREET');
				break;
			}
		}
	}

	//Do natural language things here
}

process(' ');
