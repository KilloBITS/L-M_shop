global.parseLanguage = function(req){
	switch(req.cookies.pageLang){
		case 'ru': return 'RU' ;break;
		case 'ua': return 'UA' ;break;
		case 'en': return 'EN' ;break;
		default: return 'RU'
	}
}