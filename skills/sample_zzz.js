module.exports = function(controller){

	controller.hears(['(.*)'], 'message_received,facebook_postback', function(bot, message) {
        bot.startConversation(message, function(err, convo) {
            convo.say("Sorry, i can't understand what did you want to tell me!")
            convo.say('You can try: \n"color" \n"question"')
        })
    })
}