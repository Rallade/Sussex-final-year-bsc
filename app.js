const gcl = require('@google-cloud/language')
const yargs = require('yargs')

console.log('Loaded all libraries');

const client = new gcl.LanguageServiceClient();
const args = yargs.argv

var sent = args._.join(' ');

console.log(sent);

const document = {
    content: sent,
    type: 'PLAIN_TEXT',
    language: 'fr'
};

client
	.analyzeSyntax({document})
	.then(results => {
        	const syntax = results[0];
	        console.log('Parts of speech');
		syntax.tokens.forEach(part => {
			console.log(`${part.partOfSpeech.tag}: ${part.text.content}`);
			console.log(`Morphology:`, part.partOfSpeech);
			console.log(`Dependency: ${part.text.content} is a ${part.dependencyEdge.label} of ${syntax.tokens[part.dependencyEdge.headTokenIndex].text.content}`);
      if(part.partOfSpeech.tag == VERB){

      }
    });
	})
	.catch(err => {
		console.error(err)
	});
