var request = require("request");




var checkGrammar = sent => {
  var options = {
    method: 'POST',
    url: 'https://languagetool.org/api/v2/check',
    headers: {
       'cache-control': 'no-cache',
       'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      text: 'Cest du françaises',
      language: 'fr'
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (JSON.parse(body).matches.length) {
      console.log('there were errors');
      console.log(JSON.parse(body).matches.length);
    } else {
      console.log('there were no errors');
    }
    console.log();
  });
}

module.exports.checkGrammar = checkGrammar;
