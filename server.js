const express = require('express');

app.use(express.static(__dirname + '/public'))

express.listen(3000);
