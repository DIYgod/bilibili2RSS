var express = require('express');
var logger = require('./tools/logger');

logger.info(`🍻 bilibili2RSS start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/user/:uid', require('./routes/user'));
app.get('/user/fav/:uid', require('./routes/fav'));
app.get('/user/coin/:uid', require('./routes/coin'));
app.get('/partion/:tid', require('./routes/partion'));
app.get('/bangumi/:seasonid', require('./routes/bangumi'));
app.listen(1203);