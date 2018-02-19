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
	'ORIGINS': null
}

var user_speaking = true;

var sys_int = [];
var user_int = [];

function process(sent){
	if (user_speaking){
		parse_int(sent);
	}
	gen_intent()
	if(!user_speaking){
		gen_response();
	}

}

function gen_intent(){
	if (user_int.length == 0 and sys_int.length == 0){
		sys_int.push(system_intents[0]);
		sys_int.push(system_intents[1]);
	} else if (user_int.length > 0 && sys_int.length == 0) {
		sys_int = JSON.parse(JSON.stringify(user_int)); //provides a deep copy of everything in the array
	} else {
		for (let topic in user_int){
			if(!completed_intents.includes(topic)){
				sys_int.push(topic);
				break;
			}
		}
	}
}

function gen_response(){
	resp = ''
	for (let topic in sys_int){
		completed_intents.push(topic)
		resp+=(topic + " ");
	}
	return(resp);
}

function parse_intent(sent){
	if(!completed_intents.includes('GREET')){
		for (i = 0; i < greetings.length; i++){
			if(sent.contains(greetings[0])){
				formality = i;
				user_int = 'GREET'
			}
		}
	}

	//Do natural language things here
}

process('Bonjour');
