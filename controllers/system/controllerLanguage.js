global.parseLanguage = function(req){
	switch(req.cookies.pageLang){
		case 'ru': return 'RU' ;break;
		case 'ua': return 'UA' ;break;
		case 'en': return 'EN' ;break;
		default: return 'RU'
	}
}

global.parseNumLang = function(req){
	switch(req.cookies.pageLang){
		case 'ru': return 0 ;break;
		case 'ua': return 1 ;break;
		case 'en': return 2 ;break;
		default: return 0;
	}
}


