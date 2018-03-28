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
  data = req.body;
  data = app.fillData(data);
  console.log(JSON.stringify(data, null, 4));
  app.process2(data)
    .then((analysis) => {
      console.log('sending response');
      console.log(JSON.stringify(analysis, null, 4));
      res.send(JSON.stringify(analysis, null, 4));
    });
})

exp.listen(8080);
