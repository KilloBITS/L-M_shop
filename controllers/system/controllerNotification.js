const mongoClient = require("mongodb").MongoClient;

global.notification = function(a,b,c){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const notification = db.collection("NOTIFICATION");
		if(err) return console.log(err);
		var NOTY = {};
		NOTY.text = a;
		NOTY.date = b;
		NOTY.status = c;
		notification.insertOne(NOTY);
	});
}