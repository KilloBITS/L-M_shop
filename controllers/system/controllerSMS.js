// const Nexmo = require('nexmo');

// const nexmo = new Nexmo({
// 	apiKey: '8e5f959d',
// 	apiSecret: 't3KDkf6suo3RQBjV'
// })


"use strict";
exports.__esModule = true;
var https = require("https");
var querystring = require("querystring");
var md5_typescript_1 = require("md5-typescript");
/**
 *
 */
 var EpochtaApiv3 = /** @class */ (function () {
    /**
     *
     * @param public_key
     * @param private_key
     */
     function EpochtaApiv3(public_key, private_key) {
     	this.debug = false;
     	this.gatewayhost = 'api.atompark.com';
     	this.gatewaypath = '/api/sms/3.0/';
     	this.public_key = public_key;
     	this.private_key = private_key;
     }
     EpochtaApiv3.prototype.calcSum = function (params, action) {
        // action = action.toLowerCase();
        params["key"] = this.public_key;
        params["version"] = "3.0";
        params["action"] = action;
        var data = [];
        for (var pkey in params) {
        	data.push({ key: pkey, val: params[pkey] });
        }
        data.sort(function (a, b) {
        	if (a.key === b.key)
        		return 0;
        	return a.key > b.key ? 1 : -1;
        });
        var control_str = "";
        for (var i = 0; i < data.length; i++) {
        	control_str += data[i].val;
        }
        control_str += this.private_key;
        return md5_typescript_1.Md5.init(control_str);
    };
    /**
     *
     * @param sender
     * @param phone
     * @param text
     * @param datetime
     * @param callback
     * @param error_callback
     */
     EpochtaApiv3.prototype.sendSMS = function (sender, phone, text, datetime, callback, error_callback) {
     	if (datetime === void 0) { datetime = ""; }
     	var action = "sendSMS";
     	var sms_lifetime = "0";
     	var params = {};
     	params["sender"] = sender;
     	params["text"] = text;
     	params["phone"] = phone;
     	params["datetime"] = datetime;
     	params["sms_lifetime"] = sms_lifetime;
     	var control_sum = this.calcSum(params, action);
     	var data = {
     		"key": this.public_key,
     		"sum": control_sum,
     		"sender": sender,
     		"text": text,
     		"phone": phone,
     		"datetime": "",
     		"sms_lifetime": "0"
     	};
     	return this.request(data, action, callback, error_callback);
     };
    /**
     *
     * @param sender
     * @param phones
     * @param text
     * @param datetime
     * @param sms_lifetime
     * @param batch
     * @param batchinterval
     * @param callback
     * @param error_callback
     */
     EpochtaApiv3.prototype.sendSMSGroup = function (sender, phones, text, datetime, sms_lifetime, batch, batchinterval, controlnumber, callback, error_callback) {
     	if (datetime === void 0) { datetime = ""; }
     	if (sms_lifetime === void 0) { sms_lifetime = 0; }
     	if (batch === void 0) { batch = 0; }
     	if (batchinterval === void 0) { batchinterval = 0; }
     	if (controlnumber === void 0) { controlnumber = ""; }
     	var action = "sendSMSGroup";
     	action = action.toLowerCase();
     	var params = {};
     	params["sender"] = sender;
     	params["text"] = text;
     	params["phones"] = JSON.stringify(phones);
     	params["datetime"] = datetime;
     	params["sms_lifetime"] = sms_lifetime;
     	params["batch"] = batch;
     	params["batchinterval"] = batchinterval;
     	params["controlnumber"] = controlnumber;
     	var control_sum = this.calcSum(params, action);
     	var data = {
     		"sender": sender,
     		"text": text,
     		"phones": JSON.stringify(phones),
     		"datetime": datetime,
     		"sms_lifetime": sms_lifetime,
     		"batch": batch,
     		"batchinterval": batchinterval,
     		"sum": control_sum,
     		"key": this.public_key,
     		"controlnumber": controlnumber
     	};
     	return this.request(data, action, callback, error_callback);
     };
    /**
     * Create campaign
     *
     * @param [string] sender
     * @param [string] text
     * @param [int] list_id
     * @param [string] datetime
     * @param [int] batch
     * @param [int] batchinterval
     * @param [int] sms_lifetime
     * @param [string] control_phone
     * @return [map]
     */
     EpochtaApiv3.prototype.createCampaign = function (sender, text, list_id, datetime, batch, batchinterval, sms_lifetime, control_phone, callback, error_callback) {
     	var action = "createCampaign";
     	var params = {};
     	params["sender"] = sender;
     	params["text"] = text;
     	params["list_id"] = list_id;
     	params["datetime"] = datetime;
     	params["batch"] = batch;
     	params["batchinterval"] = batchinterval;
     	params["sms_lifetime"] = sms_lifetime;
     	params["control_phone"] = control_phone;
     	var control_sum = this.calcSum(params, action);
     	var data = {
     		"sender": sender,
     		"text": text,
     		"list_id": list_id,
     		"datetime": datetime,
     		"batch": batch,
     		"batchinterval": batchinterval,
     		"sms_lifetime": sms_lifetime,
     		"control_phone": control_phone,
     		"key": this.public_key,
     		"sum": control_sum
     	};
     	return this.request(data, action, callback, error_callback);
     };
    /**
     * Add phone to addressbook
     *
     * @param [int] id_addressbook
     * @param [string] phone
     * @param [string] variables
     * @return [map]
     */
     EpochtaApiv3.prototype.addPhoneToAddressBook = function (id_addressbook, phone, variables, callback, error_callback) {
     	var action = "addPhoneToAddressBook";
     	var params = {};
     	params["idAddressBook"] = id_addressbook;
     	params["phone"] = phone;
     	params["variables"] = variables;
     	var control_sum = this.calcSum(params, action);
     	var data = {
     		"idAddressBook": id_addressbook,
     		"phone": phone,
     		"variables": variables,
     		"key": this.public_key,
     		"sum": control_sum
     	};
     	return this.request(data, action, callback, error_callback);
     };
    /**
     * Get user balance
     *
     * @param [string] currency
     * @return [map]
     */
     EpochtaApiv3.prototype.getUserBalance = function (currency, callback, error_callback) {
     	if (currency === void 0) { currency = "USD"; }
     	var action = "getUserBalance";
     	var params = {};
     	params["currency"] = currency;
     	var control_sum = this.calcSum(params, action);
     	var data = {
     		"currency": currency,
     		"key": this.public_key,
     		"sum": control_sum
     	};
     	return this.request(data, action, callback, error_callback);
     };
    /**
     * Add addressbook
     *
     * @param [string] name
     * @param [string] description
     * @return [map]
     */
     EpochtaApiv3.prototype.addAddressbook = function (name, description, callback, error_callback) {
     	var action = "addAddressbook";
     	var params = {};
     	params["name"] = name;
     	params["description"] = description;
     	var control_sum = this.calcSum(params, action);
     	var data = {
     		"name": name,
     		"description": description,
     		"key": this.public_key,
     		"sum": control_sum
     	};
     	return this.request(data, action, callback, error_callback);
     };
     EpochtaApiv3.prototype.handle_result = function (data) {
     	if (data['http_code'] != 200) {
     		data['is_error'] = true;
     	}
     	return data;
     };
    /**
     * 1
     * @param xml
     * @param type
     * @param callback
     * @param error_callback
     */
     EpochtaApiv3.prototype.request = function (data, action, callback, error_callback) {
     	if (this.debug) {
     		console.log({ data: data, action: action });
     		return true;
     	}
     	var _this = this;
     	var postData = querystring.stringify(data);
     	var options = {
     		hostname: this.gatewayhost,
     		port: 443,
     		path: this.gatewaypath + action,
     		method: 'POST',
     		headers: {
     			'Content-Type': 'application/x-www-form-urlencoded',
     			'Content-Length': postData.length
     		}
     	};
     	var req = https.request(options, function (res) {
     		if (res.statusCode == 200) {
     			res.on('data', function (d) {
     				var result = JSON.parse(d);
     				var code = parseInt(result.code);
                    if (code >= 0) { // OK
                    	callback(result);
                    }
                    else {
                    	error_callback(result);
                    }
                });
     		}
     		else {
     			error_callback({ error: "uknown", result: 'false' });
     		}
     	});
     	req.on('error', function (e) {
     		error_callback({ error: "uknown", message: e + '', result: 'false' });
     	});
     	req.write(postData);
     	req.end();
     	return true;
     };
    /**
     *
     * @param status
     */
     EpochtaApiv3.prototype.error_handler = function (custom_message) {
     	var data = { 'is_error': true };
     	if (custom_message) {
     		data['message'] = custom_message;
     	}
     	return data;
     };
     return EpochtaApiv3;
 }());
var api3 = new EpochtaApiv3('004f59d3992243f0525170a8b16dee1b', 'dfba07bbd3f900c202e6509845256f6f');

global.sendSMS =  function(number){	
	api3.sendSMSGroup("LadyMan", [[number]], "Test nmessage flom LadyMan", "", 0, 0, 0, "", function (res) { console.log(res); }, function (res) { console.log(res); }); // 
}


// api3.addAddressbook("typeScript3", "create from typescript", (res: any) => {console.log(res)}, (res: any) => {console.log(res)}); // { result: { addressbook_id: 1485588 } }

// api3.addPhoneToAddressBook(1485588, "380933630000", "", (res: any) => {console.log(res)}, (res: any) => {console.log(res)}); // { result: { phone_id: 457466228 } }

// api3.createCampaign("smSender", "message from typescript", 1485588, "", 0, 0, 0, "", (res: any) => {console.log(res)}, (res: any) => {console.log(res)}); // { result: { id: 118970671, price: 0.013300399011970358, currency: 'USD' } }

// api3.getUserBalance("USD", (res: any) => {console.log(res)}, (res: any) => {console.log(res)});

// api3.sendSMS("smSender", "380933630000", "", "", (res: any) => {console.log(res)}, (res: any) => {console.log(res)}); //

