var greetings = ['bonjour', 'salut', 'coucou'];

var goodbyes = ['au revoir', 'salut' ,'à plus'];

var system_intents = ['GREET', 'NAME', 'AGE', 'OCCUPATION', 'ORIGINS', 'BYE'];

var completed_intents = [];

var user_intents = ['GREET', 'NAME', 'AGE', 'OCCUPATION', 'ORIGINS', 'BYE'];

var user_speaking = false;

var start = false;
var end = false;

var sys_int = null;
var user_int = null;

function parse(sent){
	if (!start){
		for (let greet of greetings){
			console.log(greet);
			if (sent.includes(greet)){
				start = true;
				if (user_speaking){
					get_intent(sent);

				}
			}
		}

	} else {
		for (let bye of goodbyes){
			if (sent.includes(bye)){
				end = true;
				if(user_speaking){
					//reply
				}
			}
		}
	}

}

function gen_intent(){
	if (!start){
		start = true;
		gen
	} else {
		if (user_int == null){
			sys_int = system_intents[0];
		} else {
			for(let intention for system_intents){
				if (completed_intents.indexOf(intention) < 0){
					sys_int = system_intents[0];
					break;
				}
			}
		}
	} else {
		gen_response();
	}
}


parse('hello');
