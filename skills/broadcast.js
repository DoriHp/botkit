
module.exports = function(controller){
	
// sending to all open conversation
	var message_creative_id = null
	controller.api.broadcast.create_message_creative({
		    "attachment":{
		      "type":"template",
		      "payload":{
		        "template_type":"generic",
		        "elements":[
		        	{
					    "title":"Wanna get some my info?",
					    "image_url":"https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=2137451023011934&width=1024&ext=1557762132&hash=AeQ7H6W4kesgIroD",
					    "subtitle":"Visit my profile 👉",
					    "default_action": {
					        "type": "web_url",
					        "url": "https://www.facebook.com/RelieableAssistance2",
					        "messenger_extensions": "FALSE",
					        "webview_height_ratio": "FULL"
				    	}    
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
			// schedule_time : "2019-04-08T17:05:00+07:00"
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