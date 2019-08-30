var debug = require('debug')('botkit:webserver');
var fs = require('fs')

module.exports = function(webserver, controller) {

	var triggers = []
    debug('Configured GET /refresh event');
    webserver.get('/refresh2', function(req, res) {

	    controller.storage.scripts.all(function(err, all_script){
			all_script.forEach((script) => {
				triggers.push({
					id: script.id,
					trigger: script.triggers
				})
			})
		})

		var save = {triggers: triggers}

		console.log(save)

		fs.writeFileSync('../../triggers.json', JSON.stringify(save), 'utf-8')
		res.status(200);
        res.send('ok');

    });
}
