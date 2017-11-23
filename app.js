var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});


var connector = new builder.ChatConnector({
    appId: "41550489-f8b4-4f20-b0ca-f3c59cd14bb4",
    appPassword: "uumnAIGEW56wwaUM929{^$|"
});


server.post('/api/messages', connector.listen());


var bot = new builder.UniversalBot(connector, function (session) {           
   session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text)
});

luis.startDialog(bot);