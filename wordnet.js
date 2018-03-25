const fs = require('fs');
const xml2js = require('xml2js');

var parser = new xml2js.Parser();

fs.readFile('./wonef-fscore-0.1.xml', function(err, data){
  parser.parseString(data, function(err, result) {
      console.log(result.WN.SYNSET[0])
  });
});
