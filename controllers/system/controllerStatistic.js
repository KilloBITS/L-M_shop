const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

global.visitors = function(e){
	var ip = e.headers['x-forwarded-for'] || 
	e.connection.remoteAddress || 
	e.socket.remoteAddress ||
	(e.connection.socket ? e.connection.socket.remoteAddress : null);

	var geo = geoip.lookup(ip);
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const visitors = db.collection("VISITORS");

		if(err) return console.log(err);
		visitors.find({IP: ip}).toArray(function(err, resVisitor){
			// if(resVisitor.length === 0){
				visitors.insertOne({IP: ip, DATE: global.getDate(), GEOLOCATION: geo})
			// }
		}); 
	});
};