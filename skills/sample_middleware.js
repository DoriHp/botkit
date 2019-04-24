module.exports = function(controller) {

    controller.middleware.receive.use(function(bot, message, next) {

        var date = new Date().toUTCString()
        var item = {
            message: message.text,
            time: date
        }

        controller.storage.users.get(message.user, function(err, user){

            if (!user ) {
                user = {}
                user.id = message.user
                user.email = ''
                user.history = []
                user.reply = []
            }

            user.history.push(item)
            controller.storage.users.save(user, function(err, user){
                if (err) console.log('Something went wrong!' + err);
            })
        })

        function firstEntity(nlp, name) {
            return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
        }
        // do something...
        // console.log('RCVD:', message);
        if(message.nlp && firstEntity(message.nlp, 'intent')){
            let intent = message.nlp.entities.intent
            console.log(intent)
        }
        next();
    
    });
    
    
    controller.middleware.send.use(function(bot, message, next) {
        
        var reply = message.text
        var date = new Date().toUTCString()
        var item = {
            message: message.text,
            time: date
        }

        controller.storage.users.get(message.to, function(err, user){

            user.reply.push(item)
            controller.storage.users.save(user, function(err, user){
                if (err) console.log('Something went wrong!' + err);
            })
        })

        // do something...
        // console.log('SEND:', message);
        next();
    
    });

}
