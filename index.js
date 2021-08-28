const Alexa = require('ask-sdk-core');
const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const ordinal = require('ordinal')
const Database = require("@replit/database")

const app = express();
const db = new Database()

const PlayHandler = {
	//Handler for the sussy imposter intent
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
			&& Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayIntent';
	},
	async handle(handlerInput) {
		const audioUrl = "https://www.iminpain.org/among_sus.mp3"
		
		let num = await db.get("num")
		db.set("num", num + 1).then(() => {});

		return handlerInput.responseBuilder.speak(`<amazon:emotion name="disappointed" intensity="high">This is the ${ordinal(num)} time you've played this. Please make it stop.</amazon:emotion>`).addAudioPlayerPlayDirective(playBehavior="REPLACE_ALL", url=audioUrl, token="1234AAAABBBBCCCCCDDDDEEEEEFFFF", offsetInMilliseconds=10).getResponse();
		}
};

const StopHandler = {
	//Handler for the sussy imposter intent
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
			&& Alexa.getIntentName(handlerInput.requestEnvelope) === 'StopIntent';
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse();

		//return handlerInput.responseBuilder
		//	.speak(`hello world with audio <audio src="${audioUrl}"/>`)
		//	.getResponse();
		}
};

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = 'Welcome to suss player. Ask me to play or stop!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withSimpleCard('Welcome to suss player. Ask me to play or stop!', speechText)
			.getResponse();
	}
};

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
			&& Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const speechText = 'Ask me to play or stop!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withSimpleCard('You can Ask me to play or stop!', speechText)
			.getResponse();
	}
};

const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
			&& (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
				|| Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
	},
	handle(handlerInput) {
		const speechText = 'Goodbye!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.withSimpleCard('Goodbye!', speechText)
			.withShouldEndSession(true)
			.getResponse();
	}
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		// Any clean-up logic goes here.
		return handlerInput.responseBuilder.getResponse();
	}
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(`Error handled: ${error.message}`);

		return handlerInput.responseBuilder
			.speak('Sorry, I don\'t understand your command. Please say it again.')
			.reprompt('Sorry, I don\'t understand your command. Please say it again.')
			.getResponse();
	}
};

let skill = Alexa.SkillBuilders.custom()
			.addRequestHandlers(
				LaunchRequestHandler,
				PlayHandler,
				StopHandler,
				HelpIntentHandler,
				CancelAndStopIntentHandler,
				SessionEndedRequestHandler,
			)
			.addErrorHandlers(ErrorHandler)
			.create();
		
const adapter = new ExpressAdapter(skill, true, true);

app.post('/', adapter.getRequestHandlers());
app.listen(3000);