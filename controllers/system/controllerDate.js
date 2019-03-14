global.getDate = function(){
	var currentdate = new Date(); 
	var datetime = currentdate.getFullYear() +"-"+ (currentdate.getMonth()+1) +"-"+ currentdate.getDate() 
	
	return datetime
};