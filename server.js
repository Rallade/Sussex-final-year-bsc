const express = require('express');
const bodyParser = require('body-parser');
const app = require('./app.js')

var exp = express();

exp.use(bodyParser());

exp.use(express.static(__dirname + '/public'));

exp.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  next();
})

exp.post('/process', (req, res) => {
  sent = req.body.sent;
  console.log(14, sent);
  app.process2(app.createData(sent))
    .then((analysis) => {
      console.log(JSON.stringify(analysis, null, 4));
      res.send(JSON.stringify(analysis, null, 4));
    });
})

exp.listen(8080);
