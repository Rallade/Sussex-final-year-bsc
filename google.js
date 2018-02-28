const gcl = require('@google-cloud/language')
const yargs = require('yargs')

console.log('Loaded all libraries');

const client = new gcl.LanguageServiceClient();
const args = yargs.argv

var sent = args._.join(' ');
var questionMarkers = ['est-ce', 'comment', 'quel ', 'quelle ', ' quoi', 'pourquoi']

console.log(sent);

const document = {
    content: sent,
    type: 'PLAIN_TEXT',
    language: 'fr'
};

function parse(syntax){
  console.log('Parts of speech');
  shortened = []
  analysis = {question: false}
  syntax.tokens.forEach(function(part) {
    //console.log(`${part.partOfSpeech.tag}: ${part.text.content}`);
    //console.log(`Morphology:`, part.partOfSpeech);
    //console.log(`Dependency: ${part.text.content} is a ${part.dependencyEdge.label} of ${syntax.tokens[part.dependencyEdge.headTokenIndex].text.content}`);
    head = syntax.tokens[part.dependencyEdge.headTokenIndex];
    if(head.partOfSpeech.tag == 'VERB'){
      if(part.dependencyEdge.label == 'ADVMOD'){
        shortened.push(part.text.content);
        analysis.modifier = part.text.content;
      } else if (part.dependencyEdge.label == 'NSUBJ') {
        shortened.push(part.text.content);
        analysis.subject = part.text.content;
        if(part.partOfSpeech.tag == 'PRON'){
          if(syntax.tokens.indexOf(head) < syntax.tokens.indexOf(part)){
            analysis.question = true;
          }
        }
      } else if (part.dependencyEdge.label == 'PRONL'){
        shortened.push(part.text.content)
      } else if (part.dependencyEdge.label == 'ATTR'){
        shortened.push(part.text.content)
      } else if (part.dependencyEdge.label == 'DOBJ'){
        shortened.push(part.text.content);
        analysis.topic = part.text.content;
      }
    }
    if (part.dependencyEdge.label == 'POSS'){
     if (head.dependencyEdge.label == 'NSUBJ'){
      superHead = syntax.tokens[head.dependencyEdge.headTokenIndex];
      if (superHead.partOfSpeech.tag == 'VERB'){
        shortened.push(part.text.content)
        analysis.topic = part.text.content
      }
     }
    }
    if (part.dependencyEdge.label == 'DET' || part.dependencyEdge.label == 'NUM'){
      if (head.dependencyEdge.label == 'DOBJ'){
        superHead = syntax.tokens[head.dependencyEdge.headTokenIndex];
        if (superHead.partOfSpeech.tag == 'VERB'){
          shortened.push(part.text.content)
        }
      }
    }
    if (part.partOfSpeech.tag == 'VERB' && part.dependencyEdge.label != 'MARK') {
      shortened.push(part.text.content);
      analysis.verb = part.lemma;
    }

  });
  questionMarkers.forEach(function(mark){
    if(sent.toLowerCase().includes(mark)){
      analysis.question = true;
    }
  });
  analysis.keywords = shortened;
  return new Promise(function(resolve, reject) {
    resolve(analysis)
  });
}

client
	.analyzeSyntax({document})
	.then(results => {
    const syntax = results[0];
    return parse(syntax);
	}).then((analysis) => {
      console.log(analysis);
  }).catch(err => {
		console.error(err)
	});
