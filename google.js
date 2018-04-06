const gcl = require('@google-cloud/language')
const yargs = require('yargs')

console.log('Loaded all libraries');

const client = new gcl.LanguageServiceClient();
const args = yargs.argv

var sent = args._.join(' ');
var questionMarkers = ['est-ce', 'comment', 'quel ', 'quelle ', ' quoi', 'pourquoi']

console.log(sent);

async function analyze(sent) {
  var document = {
      content: sent,
      type: 'PLAIN_TEXT',
      language: 'fr'
  };
  let [syntax, entities] = await Promise.all([client.analyzeSyntax({document}), client.analyzeEntities({document})]);
  let analysis = parseSyntax(syntax[0]);
  analysis.entities = entities[0].entities;
  console.log(analysis);
  return analysis;
}

function parseSyntax(syntax){
  console.log('Parts of speech');
  shortened = []
  syntax_analysis = {question: false}
  syntax.tokens.forEach(function(part) {
    //console.log(`${part.partOfSpeech.tag}: ${part.text.content}`);
    //console.log(`Morphology:`, part.partOfSpeech);
    //console.log(`Dependency: ${part.text.content} is a ${part.dependencyEdge.label} of ${syntax.tokens[part.dependencyEdge.headTokenIndex].text.content}`);
    head = syntax.tokens[part.dependencyEdge.headTokenIndex];
    if(head.partOfSpeech.tag == 'VERB'){
      if(part.dependencyEdge.label == 'ADVMOD'){
        shortened.push(part.text.content);
        syntax_analysis.modifier = part.text.content;
      } else if (part.dependencyEdge.label == 'NSUBJ') {
        shortened.push(part.text.content);
        syntax_analysis.subject = part.text.content;
        if(part.partOfSpeech.tag == 'PRON'){
          if(syntax.tokens.indexOf(head) < syntax.tokens.indexOf(part)){
            syntax_analysis.question = true;
          }
        }
      } else if (part.dependencyEdge.label == 'PRONL'){
        shortened.push(part.text.content)
      } else if (part.dependencyEdge.label == 'ATTR'){
        shortened.push(part.text.content)
      } else if (part.dependencyEdge.label == 'DOBJ'){
        shortened.push(part.text.content);
        syntax_analysis.topic = part.text.content;
      }
    }
    if (part.dependencyEdge.label == 'POSS'){
     if (head.dependencyEdge.label == 'NSUBJ'){
      superHead = syntax.tokens[head.dependencyEdge.headTokenIndex];
      if (superHead.partOfSpeech.tag == 'VERB'){
        shortened.push(part.text.content)
        syntax_analysis.topic = part.text.content
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
      syntax_analysis.verb = part.lemma;
    }

  });
  questionMarkers.forEach(function(mark){
    if(sent.toLowerCase().includes(mark)){
      syntax_analysis.question = true;
    }
  });
  syntax_analysis.keywords = shortened;
  // return new Promise(function(resolve, reject) {
  //   resolve(syntax_analysis)
  // });
  return syntax_analysis;
}

module.exports.analyze = analyze;
