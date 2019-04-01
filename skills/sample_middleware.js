module.exports = function(controller) {

    controller.middleware.receive.use(function(bot, message, next) {

        var date = new Date().toUTCString()
        var item = {
            message: message.text,
            time: date
        }

        controller.storage.users.get(message.user, function(err, user){

            if (!user) {
                user = {};
                user.id = message.user
                user.history = []
                user.reply = []
            }

            user.history.push(item)
            controller.storage.users.save(user, function(err, user){
                if (err) console.log('Something went wrong!' + err);
            })
        })

        // do something...
        console.log('RCVD:', message);
        next();
    
    });
    
    
    controller.middleware.send.use(function(bot, message, next) {
        
        var reply = message.text
        var date = new Date().toUTCString()
        var item = {
            message: message.text,
            time: date
        }

        // controller.storage.users.get(message.to, function(err, user){

        //     user.reply.push(item)
        //     controller.storage.users.save(user, function(err, user){
        //         if (err) console.log('Something went wrong!' + err);
        //     })
        // })

        // do something...
        console.log('SEND:', message);
        next();
    
    });

}
