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
      text: sent,
      language: 'fr'
    }
  };
  return new Promise(function(resolve, reject){
    request(options, function (error, response, body) {
      if (error){
        reject(error);
      } else {
        resolve(JSON.parse(body).matches);
        matches = JSON.parse(body).matches;
      }
    });
  });
  // RETURN A PROMISE OR THERE WILL BE HEADACHES
};

module.exports.checkGrammar = checkGrammar;
