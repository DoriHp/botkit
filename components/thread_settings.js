var debug = require('debug')('botkit:thread_settings');



module.exports = function(controller) {

    debug('Configuring Facebook thread settings...');
    controller.api.thread_settings.greeting([
          {
            "locale":"default",
            "text":"Hello!"
          }, {
            "locale":"en_US",
            "text":"Hi {{user_first_name}}! <3"
          }, {
            "locale":"vi_VN",
            "text":"Xin chào {{user_first_name}}! \nTôi là Botkit bot, tôi sẽ nói chuyện với bạn một lúc trước khi admin của page quay lại!!!"
          }
        ]);
    controller.api.thread_settings.get_started('sample_get_started_payload');


    // controller.hears(['get_started'], 'facebook_postback', function(bot, message){
    //         // make http call to graph api
    //         var request = require('request')

    //         var option = {
    //             method: 'GET',
    //             url: 'https://graph.facebook.com/v3.2/' + message.sender.id + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.page_token
    //         }

    //         function callback(err, response, body){
    //             // if(!err && response.status == 200){
    //                 var user = JSON.parse(body)
    //                 bot.reply(message ,'Hi ' + user.first_name)
    //             // }
    //         }
            
    //         request(option, callback)
    //         // bot.reply(message, 'Hi ' + message.sender.id)
    //     }
    // )

    controller.hears(['get_started'], 'facebook_postback', function(bot, message){

        bot.startConversation(message, function(err, convo){
            var user = {}
            var id = message.user

            convo.ask('Can I have a question for you?' ,[
                {
                    pattern: bot.utterances.yes,
                    callback: function(response, convo){
                        convo.gotoThread('yes_thread')
                    },
                },
                {
                    pattern: bot.utterances.no,
                    callback: function(response, convo){
                        convo.gotoThread('no_thread')
                    },
                },
                {
                    default: true,
                    callback: function(response, convo){
                        convo.gotoThread('bad_response')
                    },
                }
            ])


            function validEmail(email){
                var pattern = new RegExp(/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm)
                return pattern.test(email)
            }

            //thread when user say 'yes'
            convo.addMessage({
                action: 'email_question'
            }, 'yes_thread')

            //ask for user's email

            convo.addQuestion({text : 'What is your email'}, [
                {
                    default: true,
                    callback: function(response, convo) {
                        if(validEmail(response.text) === true){
                            controller.storage.users.get(user, function(err, user) {

                                user.email = response.text

                                controller.storage.users.save(user, function(err,saved) {

                                    if (err) {
                                        convo.say('Something went wrong~')
                                    } else {
                                        convo.gotoThread('valid_email')
                                    }

                                });
                            });
                        }else{
                            convo.gotoThread('invalid_email')
                        }
                    },
                }
            ],{},'email_question');

            convo.addMessage({text:"Invalid email", action: 'email_question'}, 'invalid_email')

            convo.addMessage({text:"Thanks you!", }, "valid_email");

            // ask('What is your email?', function(response, convo) {
            //     convo.setVar('email',response.text);
            //     while(validEmail(vars.email) !== true){
            //         convo.ask('Invalid email, re-enter here:', function(response, convo){
            //             return vars.email = response.text
            //         })
            //     }
            //     convo.say('Thanks you!')
            //     convo.next();
            // })



            //thread when user say 'no'
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
        })
    })

    controller.api.thread_settings.menu([
        {
        "locale":"default",
        "composer_input_disabled":false,
        "call_to_actions":[
            {
                "title":"My Skills",
                "type":"nested",
                "call_to_actions":[
                    {
                        "title":"Hello",
                        "type":"postback",
                        "payload":"Hello"
                    },
                    {
                        "title":"Hi",
                        "type":"postback",
                        "payload":"Hi"
                    }
                ]
            },
            {
                "type":"web_url",
                "title":"Botkit Docs",
                "url":"https://github.com/howdyai/botkit/blob/master/readme-facebook.md",
                "webview_height_ratio":"full"
            }
        ]
    },
    {
        "locale":"zh_CN",
        "composer_input_disabled":false
    }]);
}
