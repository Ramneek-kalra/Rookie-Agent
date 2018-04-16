var restify = require('restify');
var builder = require('botbuilder');
var emoji = require('node-emoji');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector, [
    	function (session) {
	    	session.send("Welcome to your Own Personal Assistant! My Name is **Rookie**.");
	        builder.Prompts.text(session, "Hey there! What's your name?");
	    },
	    function (session, results) {
	        session.userData.name = results.response;
	        builder.Prompts.number(session, "Hi **" + results.response + "**, How old are you?"); 
	    },
	    function (session, results) {
	        session.userData.age = results.response;
	        builder.Prompts.text(session,"Great to meet you, A Strong Coder with "+results.response+" Years Old."); 
	        session.send("Which Programming Language do you Prefer at your Command Language?"); 
	    },
	    function (session, results) {
	        session.userData.lang = results.response;
	        builder.Prompts.text(session,"Wow! Me too coded in "+ results.response+" Language, Great to Know! "+emoji.get('smiley')); 
	        session.send("Thanks for taking time to introduce yourself! Hope I will help you again.Bye!");
	    }
]).set('storage', inMemoryStorage);