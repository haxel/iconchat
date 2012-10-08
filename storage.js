(function(exports) {
	var mongo = require('mongodb'),
		db = new mongo.Db('iconchat', new mongo.Server("127.0.0.1", 27017));

	db.open(function(err) {
    	if(err) {
	        db.close();
    	    process.exit(1);
    	} else {
        	console.log('db connection open')
    	}
	});

    exports.storeMessage = function(message) {
    	db.collection('path', function(err, collection) {
      		message.date = Date.now();
     		collection.insert(message, function(err) {
      		});
      	})
  	};
    exports.importPath = function(callback) {
		db.collection('path', function(err, collection) {
        	collection.find( {}, { sort: [[ "date", "desc" ]], limit: 25 }).toArray( function(err, messages) {
            	for (var i = messages.length - 1; i >= 0; i--) {
              		callback(messages[i]);
            	};
       		});
   		});
	};
})(module.exports)