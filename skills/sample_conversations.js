/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's conversation system.

In this example, Botkit hears a keyword, then asks a question. Different paths
through the conversation are chosen based on the user's response.

*/

module.exports = function(controller) {

    var request = require('request')
    controller.hears(['input'], 'message_received', function(bot, message){

        bot.startConversation(message, function(err, convo){
            convo.say('This is an example of using Spellcheck API and mongoStorage')
            convo.ask('Input a sentences here:', function(response, convo){
                //set option for request api
                var options = {
                    method: 'GET',
                    uri: "https://montanaflynn-spellcheck.p.rapidapi.com/check/?text=" + response.text,
                    headers: {
                        'X-RapidAPI-Key': '7e6d1b4da1msh1138da086a26a0bp16ed03jsndad1f72ad6da'
                    }
                };

                convo.task.timeLimit = 3000

                // convo.on('end',function(convo) {

                //   if (convo.status=='timeout') {
                //     // do something useful with the users responses
                //         convo.say('Oh no, our time has expired!!!')
                //     }
                // })

                // convo.setTimeout(3000)

                convo.addMessage({
                    text : 'Oh no, our time has expired!!!'
                }, 'on_timeout')

                function callback(err, response, body){
                    let result = JSON.parse(body)
                    if(result.original !== result.suggestion){
                    //ask and create thread for the answer
                    convo.ask('Did you mean "' + result.suggestion + '"?', [
                        {
                            pattern:  bot.utterances.yes,
                            callback: function(response, convo) {
                                convo.gotoThread('yes_thread');
                            },
                        },
                        {
                            pattern:  bot.utterances.no,
                            callback: function(response, convo) {
                                convo.gotoThread('no_thread');
                            },
                        },
                    
                        {
                            default: true,
                            callback: function(response, convo) {
                                convo.gotoThread('bad_response');
                            },
                        }
                    ])
                    // create a path for when a user says YES
                    convo.addMessage({
                            text: 'OK, I will save the correction.',
                    },'yes_thread');

                    // create a path for when a user says NO
                    // mark the conversation as unsuccessful at the end
                    convo.addMessage({
                        text: 'OK, I will save the original.',
                    },'no_thread');

                    // create a path where neither option was matched
                    // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
                    convo.addMessage({
                        text: 'Sorry I did not understand. Say `yes` or `no`',
                        action: 'default',
                        },'bad_response');
                    }else{
                        convo.say("Message has been saved!")
                    }
                    convo.next()
                }

                request(options, callback)

                    //Ask user to choose what is right
                })
            })
    })

    controller.hears(['color'], 'message_received', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            
            convo.say('This is an example of using convo.ask with a single callback.');

            convo.ask('What is your favorite color?', function(response, convo) {

                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();
            })

        })

    })

    var pattern_api = new RegExp(/^employee\s[0-9]{4}$/gm)

    controller.hears([pattern_api], 'message_received', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            
            var id = message.text.substring(9)

            // convo.say(' id isl ' + id);
            
            var option = {
                method: 'GET',
                url: 'http://dummy.restapiexample.com/api/v1/employee/' + id
            }

            function callback(err, response, body){
                convo.say('Your result for id = ' + id + ':')
                if(err) {
                    debug('Error occured!')
                    throw new Error(err)
                }
                console.log(body)
                let info = JSON.parse(body)
                
                let result = ''
                Object.entries(info).forEach(entry => {
                  let key = entry[0];
                  let value = entry[1];
                  result += key + ":" + value + "\n"
                })
                convo.say(result)
            }

            request(option, callback)
            convo.next()
        })

    })

    controller.hears(['question'], 'message_received', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            // create a path for when a user says YES
            convo.addMessage({
                    text: 'How wonderful.',
            },'yes_thread');

            // create a path for when a user says NO
            // mark the conversation as unsuccessful at the end
            convo.addMessage({
                text: 'Cheese! It is not for everyone.',
                action: 'stop', // this marks the converation as unsuccessful
            },'no_thread');

            // create a path where neither option was matched
            // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
            convo.addMessage({
                text: 'Sorry I did not understand. Say `yes` or `no`',
                action: 'default',
            },'bad_response');

            // Create a yes/no question in the default thread...
            convo.ask('Do you like cheese?', [
                {
                    pattern:  bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.gotoThread('yes_thread');
                    },
                },
                {
                    pattern:  bot.utterances.no,
                    callback: function(response, convo) {
                        convo.gotoThread('no_thread');
                    },
                },
                {
                    default: true,
                    callback: function(response, convo) {
                        convo.gotoThread('bad_response');
                    },
                }
            ]);

            convo.activate();

            // capture the results of the conversation and see what happened...
            convo.on('end', function(convo) {

                if (convo.successful()) {
                    // this still works to send individual replies...
                    bot.reply(message, 'Let us eat some!');

                    // and now deliver cheese via tcp/ip...
                }

            });
        });

    });

};
