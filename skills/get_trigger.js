
module.exports = async function(controller) {


	var triggers = []
    // await webserver.get('/refresh', function(req, res) {

	    controller.storage.scripts.all(await function(err, all_script){
	    	if(!err){
	    		for(let i of all_script){
	    			triggers.push({
	    				id: i.id,
						trigger: i.triggers
	    			})
	    		}
	    	}else{
	    		console.log("Can not get triggers!")
	    	}

		})

		// res.status(200).end()

    // })

  	controller.hears(['(.*)'], 'message_received', async function(bot, message){

      var taggedMessage = {
        "text": "Hi, guy!. Now you can order a SIM card by chatting with my Bot!", 
        "tag": "FEATURE_FUNCTIONALITY_UPDATE",
        "messaging_type": "MESSAGE_TAG",
      }

      bot.reply(message, taggedMessage)
  		//tìm kiếm trigger trong biến cục bộ
    	// var result = await triggers.filter(value => {
    	// 	let test = false
    	// 	for(let i of value.trigger){
    	// 		if(message.text.indexOf(i) != -1){
    	// 			test = true
    	// 		}
    	// 	}
    	// 	if(test == true) return value
    	// })

     //    //tìm kiếm script với id vừa lấy được
    	// var data = await controller.storage.scripts.find({id : result[0].id}, function(err, script){
    	// 		if(!err) return script
    	// })

     //    //trường hợp script là response
    	// if(data[0].type == "response"){
    	// 	data[0].script.forEach(element =>{
    	// 		switch (element.type) {
    	// 			case 'text':
    	// 				bot.reply(message, element.response)
    	// 				break;
    	// 			case 'template':
    	// 			case 'image':
    	// 				delete element.type
    	// 				bot.reply(message, element)
    	// 				break
    	// 			default:
    	// 				// statements_def
    	// 				break;
    	// 		}
    	// 	})
    	// }
    	// if(data[0].type == "question"){
    	// 	bot.startConversation(message, function(err, convo){
    	// 		// if(content.type == 'text'){
    	// 		// 	convo.ask(content.question.text, create_res_mapping(data.script.question))
    	// 		// }
     //            var pattern1 = create_pattern(data[0].response_mapping[0])
     //            var pattern2 = create_pattern(data[0].response_mapping[1])

     //            var res =  data[0].r
    	// 		convo.ask(data[0].script.question, [
    	// 			{
    	// 				pattern: pattern1,
     //                    callback: function(response, convo){
     //                    	convo.gotoThread('q1_thread')
     //                	},
    	// 			},
    	// 			{
    	// 				pattern: pattern2,
     //                    callback: function(response, convo){
     //                    	convo.gotoThread('q2_thread')
     //                	},
    	// 			}
    	// 			])
	    // 		convo.addMessage({
	    // 			text: 'Đồng ý',
	    //             action: 'stop'
	    //         }, 'q1_thread')

	    //         convo.addMessage({
	    //         	text: 'Từ chối',
	    //             action: 'stop'
	    //         }, 'q2_thread')
    		
	    //         function create_pattern(data){
			    	
		   //  		var pattern = "^(" + data.responses.join('|') + ")"
		   //  		var reg = new RegExp(pattern, "i")
     //                console.log(reg)
			  //   	return reg
			  //   }
     //            convo.task.timeLimit = 10000
    	// 	})
    	// }
    })

}
