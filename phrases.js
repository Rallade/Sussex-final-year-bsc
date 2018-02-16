var greetings = ['bonjour', 'salut', 'coucou'];

var goodbyes = ['au revoir', 'salut' ,'à plus'];

var system_intents = {'NAME': 0, 'AGE': 1, 'OCCUPATION': 2, 'ORIGINS': 3};

var completed_intents = [];

var user_intents = {'NAME': 0, 'AGE': 1, 'OCCUPATION': 2, 'ORIGINS': 4};

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
                                        //reply
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

function gen_intent()(
	if (!start){
		start = true;
		return greetings[0];
	} else {
		if (user_int == null){
			sys_int = 'NAME';
		} else {
			
		}
	}
}

parse('hello');



