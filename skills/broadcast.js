
module.exports = function(controller){
	
// sending to all open conversation
	var message_creative_id = null
	controller.api.broadcast.create_message_creative({
		    "attachment":{
		      "type":"template",
		      "payload":{
		        "template_type":"button",
		        "text":"Wanna get some info?#2",
		        "buttons":[
		          {
		            "type":"web_url",
		            "url":"https://www.facebook.com/RelieableAssistance2",
		            "title":"Visit my profile"
		          }
		        ]
		      }
		    }
		}
	, function (err, body) {
	    
	    message_creative_id = body['message_creative_id']
	    // option for broadcast message
		var message = {
			message_creative_id : message_creative_id
			// schedule_time : "2019-04-08T16:05:00+07:00"
		}
		//sending process
		controller.api.broadcast.send(message, function(err, body){
			let broadcast_id = body['broadcast_id']

			//broadcast metric
			controller.api.broadcast.get_broadcast_metrics(broadcast_id, function (err, body) {
				console.log(body)
				let now = Date()
	    		console.log(now.toUTCString())
			})
		})
	})

}