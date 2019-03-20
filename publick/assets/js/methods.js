var NEWSFILELOGO = 'default.jpg';
var NEWSFILECONTENTIMAGE = ['','','','','','','',''];
var SIZESARRAY = [];
var TOVARIMAGE = ['','','','','','','',''];
var create_alert = function(a,b){
	var modalWin = document.createElement('div');
	modalWin.className = 'modalWin';
	modalWin.innerHTML = a.message;
	$('body').append(modalWin);
	$('.preloaderBlock').fadeOut(100);
	if(b){
		$(modalWin).append('<span>Страница будет обновлена через 3 секунды</span>');
		var defInt = 3;
		reload = setInterval(function(){
			defInt = defInt - 1;
			$('.modalWin span').html('Страница будет обновлена через '+defInt+' секунды');
			if(defInt <= 0){
				clearInterval(reload)
				location.reload();
			}
		}, 1000)
	}else{
		setTimeout(function(){
			$(modalWin).fadeOut('slow', function() { $(this).remove(); }); //
		},3000)
	}
}

var getBase64 = function(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

var rus_to_latin = function(str){
    var ru = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
        'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 
        'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
    }, n_str = [];    
    str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');    
    for ( var i = 0; i < str.length; ++i ) {
       n_str.push(
              ru[ str[i] ]
           || ru[ str[i].toLowerCase() ] == undefined && str[i]
           || ru[ str[i].toLowerCase() ].replace(/^(.)/, function ( match ) { return match.toUpperCase() })
       );
    }    
    return n_str.join('');
}

function xmlToJson(xml) {
	var obj = {};
	if (xml.nodeType == 1) {
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}
	if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
		obj = xml.childNodes[0].nodeValue;
	}
	else if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
var INDEX = {
	init: function(){
		$("#wievers").val();
		$("#buyers").val();
		//ONLOAD
		INDEX.tovarststistik();
	},
	tovarststistik: function(){
	    var ctx = document.getElementById("seolinechart8").getContext('2d');
	    var chart = new Chart(ctx, {
	        type: 'doughnut',
	        data: {
	            labels: ["FB", "TW", "G+", "INS"],
	            datasets: [{
	                backgroundColor: [
	                    "red",
	                    "#12C498",
	                    "#F8CB3F",
	                    "#E36D68"
	                ],
	                borderColor: '#fff',
	                data: [10, 410, 260, 150],
	            }]
	        },
	        // Configuration options go here
	        options: {
	            legend: {
	                display: true
	            },
	            animation: {
	                easing: "easeInOutBack"
	            }
	        }
	    });
	}

}

var NEWS = {
	removenews: function(a){
		$('.preloaderBlock').fadeIn(100);
		$.post('/setRemoveNews',{a:parseInt(a)}, (res) => {
			var table = $('#dataTable3').DataTable(); 
			table.clear();
			for(let i = 0; i < res.data.length; i++){
				table.row.add( [
		            res.data[i].AI,
		            res.data[i].title[0],
		            res.data[i].date,
		            res.data[i].views,
		            '<button type="button" class="btn btn-danger btn-xs mb-3" onclick="NEWS.removenews('+res.data[i].AI+')">Удалить</button>'+
		            '<a href="/editNews?mode=edit,'+res.data[i].AI+'" target="_blank" class="btn btn-warning btn-xs mb-3">Редактировать</a>'
		        ] ).draw( false );
			}			
			create_alert(res, false)
		});
	},
	getBase64: function(file) {
	  return new Promise((resolve, reject) => {
	    const reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = () => resolve(reader.result);
	    reader.onerror = error => reject(error);
	  });
	},
	selectNewsLogo: function(){
		var file = document.querySelector('#inputGroupFile01').files[0];
		NEWS.getBase64(file).then(
		  data => NEWSFILELOGO = data
		);
	},
	selectNewsContentImage: function(e,i){
		var fullPath = $(e).val();
		if (fullPath) {
		    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		    var filename = fullPath.substring(startIndex);
		    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
		        filename = filename.substring(1);

		        var file = document.querySelector('#'+$(e).attr('id')).files[0];
				NEWS.getBase64(file).then(
				  function(data){
				  	NEWSFILECONTENTIMAGE[i] = data;
				  	$(".addEditImage:eq("+(i+1)+")").css({"background-image":"url("+data+")","opacity":"1"}).html('').append('<div class="openedImage" style="background-image: url('+data+')"></div>');
				  	$(".custom-file-label:eq("+(i+1)+")").html(filename);
				  }
				);
		    }
		    $(e).parent().children()[1].innerHTML = filename
		}
	},
	parseDomNews: function(a){
		var NN = {
			title:  [
				$('#example-text-input-RU').val(),
				$('#example-text-input-UA').val(),
				$('#example-text-input-EN').val()
			],
			text:  [
				$('#home1 .note-editable').html(),
				$('#profile1 .note-editable').html(),
				$('#contact1 .note-editable').html()
			],
			date:  $('#example-date-input').val(),
			logo: NEWSFILELOGO,
			images: NEWSFILECONTENTIMAGE
		}

		if(a !== undefined){
			NN.a = a
		}

		return NN
	},
	addnews: function(){
		$.post('/setNewNews', NEWS.parseDomNews(), function(res){
			create_alert(res, false)
		})
	},
	savenews: function(a){
		$.post('/saveEditNews', NEWS.parseDomNews(a), function(res){
			create_alert(res, false)
		})
	}
}

var ABOUT = {
	save: function(){
		$('.preloaderBlock').fadeIn(100);
		$.post('/saveAboutText', {
			a: $('#home .note-editable').html(),
			b: $('#profile .note-editable').html(),
			c: $('#contact .note-editable').html() 
		},(res) => {
			create_alert(res, false)
		})
	}
}

var TOF = {
	save: function(){
		$('.preloaderBlock').fadeIn(100);
		$.post('/saveTermsOfUseText', {
			a: $('#home .note-editable').html(),
			b: $('#profile .note-editable').html(),
			c: $('#contact .note-editable').html() 
		},(res) => {
			create_alert(res, false)
		})
	}
}

var PRIVACEPOLICY = {
	save: function(){
		$('.preloaderBlock').fadeIn(100);
		$.post('/savePrivacePolicyText', {
			a: $('#home .note-editable').html(),
			b: $('#profile .note-editable').html(),
			c: $('#contact .note-editable').html() 
		},(res) => {
			create_alert(res, false)
		})
	}
}

var USER = {
	updatetable: function(a){
		var table = $('#dataTable3').DataTable(); 
		table.clear();
		for(let i = 0; i < a.length; i++){
			if(a[i].blocked){ 
            var dolg = '<td class="redBack">Заблокирован</td>'
            }else{   
                if(a[i].isAdmin){ 
                	var dolg = '<td class="redTable youAdmin"><div class="official"></div>Администратор</td>'
                }else{    
                	var dolg = '<td class="greenTable">Пользователь</td>'
                } 
            } 

            //parse button

            if(a[i].blocked){ 
            var blockBtn = '<button type="button" class="btn btn-success btn-xs mb-3" onclick="USER.block('+ a[i].AI +',false)">Разблокировать</button>'
            }else{
            var blockBtn = '<button type="button" class="btn btn-danger btn-xs mb-3" onclick="USER.block('+ a[i].AI +',true)">Заблокировать</button>'
            }
            
            var editBtn = '<button type="button" class="btn btn-warning btn-xs mb-3" onclick="USER.edit('+ a[i].AI +')">Редактировать</button>'

            if(a[i].isAdmin){
            var adminBtn = '<button type="button" class="btn btn-secondary btn-xs mb-3" onclick="USER.setadmin('+ a[i].AI +',false)">Разжаловать администратора</button>'
            }else{
            var adminBtn = '<button type="button" class="btn btn-secondary btn-xs mb-3" onclick="USER.setadmin('+ a[i].AI +',true)">Назначить администратором</button>'
            }            

            var deleteBtn = '<button type="button" class="btn btn-dark btn-xs mb-3" onclick="USER.delete('+a[i].AI +')">Удалить</button>'

            var resButtonLine = blockBtn + editBtn + adminBtn + deleteBtn;

			table.row.add( [
	            a[i].AI,
	            a[i].nick,
	            '<a href="mailto:'+a[i].email+'?subject=Администрация Lady&Man clothing store" class="adressLineMap">'+a[i].email+'</a>',
	            '<a href="tel:'+a[i].phone_number+'" class="adressLineMap">'+a[i].phone_number+'</a>',
	            a[i].LM_COIN,
	            dolg,
	            resButtonLine
	            
	        ] ).draw( false );
		}			
	},
	block: function(a, b){
		var checkClick = confirm('Вы действительно хотите заблокировать пользователя ?');
		if(checkClick){
			$('.preloaderBlock').fadeIn(100);
			$.post('/blockUser',{a:a, b:b},(res) => {
				USER.updatetable(res.data);
				create_alert(res, false)
			})
		}		
	},
	edit: function(a){
		$('.preloaderBlock').fadeIn(100);
		$.post('/editUserData',{a:a},(res) => {
			USER.updatetable(res.data);
			create_alert(res, false)
		})
	},
	delete: function(a){
		var checkClick = confirm('Вы действительно хотите УДАЛИТЬ пользователя ?');
		if(checkClick){
			$('.preloaderBlock').fadeIn(100);
			$.post('/deleteUser',{a:a},(res) => {
				USER.updatetable(res.data);
				create_alert(res, false)
			});
		}
	},
	setadmin: function(a, b){
		var checkClick = confirm('Вы действительно хотите назначить администратором пользователя ?');
		if(checkClick){
		$('.preloaderBlock').fadeIn(100);
			$.post('/setAdmUser',{a:a, b: b},(res) => {
				USER.updatetable(res.data);
				create_alert(res, false)
			})
		}	
	}
}

var CATALOG = {
	JSON_FILE: {},
	setcolortovar: function(a,b){
		$('.preloaderBlock').fadeIn(100);
		$.post('/setcolor',{a:a, b:b}, (res) => {
			var table = $('#dataTable3').DataTable(); 
			table.clear();			
			for(let i = 0; i < res.data.length; i++){
				if(res.data[i].sale[0] === 'true'){
	                var btn1 = '<strike>'+res.data[i].price +' ГРН</strike><b class="blink" style="color: red">'+ parseInt(res.data[i].price - res.data[i].price / 100 * parseInt(res.data[i].sale[1]))+' Грн</b>'
	            }else{
	                var btn1 = '<b> <%= tovarData[i].price %> ГРН </b>'
	            }
	            var colorBtn = '<div class="dropdown col-lg-6 col-md-4 col-sm-6">'+
	                '<button class="btn btn-light dropdown-toggle" style="background-color:'+res.data[i].color+' " type="button" data-toggle="dropdown" aria-expanded="false">'+
	                res.data[i].color+
	                '</button>'+             
	            '</div>'
				table.row.add( [
		            res.data[i].AI,
		            '<div class="iconoftovar '+ res.data[i].type +'"></div>',
		            '<img src="'+res.data[i].images[0]+'" style="max-height: 30px; max-width: 30px;">',
		            res.data[i].title[0],
		            btn1,
		            'Данные временно недоступны',
		            colorBtn,
		            res.data[i].author,
		            res.data[i].code,
		            'Данные временно недоступны',		            
		           	'<button type="button" class="btn btn-danger btn-xs mb-3" onclick="CATALOG.remove("'+ res.data[i].AI +'")">Удалить</button>',
		           	'<a href="/editTovar?mode=edit,'+ res.data[i].AI +'" class="btn btn-warning btn-xs mb-3">Редактировать</a>'
		        ] ).draw( false );
			};
			create_alert(res, false)
		});
	},
	selectNewsContentImage: function(e,i){
		var fullPath = $(e).val();
		if (fullPath) {
		    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		    var filename = fullPath.substring(startIndex);
		    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
		        filename = filename.substring(1);

		        var file = document.querySelector('#'+$(e).attr('id')).files[0];
				getBase64(file).then(
				  function(data){
				  	TOVARIMAGE[i] = data;
				  	$(".addEditImage:eq("+(i)+")").css({"background-image":"url("+data+")","opacity":"1"}).html('').append('<div class="openedImage" style="background-image: url('+data+')"></div>')
				  }
				);
		    }
		    $(e).parent().children()[1].innerHTML = filename
		}
	},
	categoriesselect: function(e){
		$('.miniloader').show();
		var value = $(e).val();
		$.post('/getTypesOfCatalog',{a:value},(res) => {
			$('#typeSelect').empty()
			for(let i = 0; i < res.data.length; i++){
				$('#typeSelect').append(new Option(res.data[i].pname[0], res.data[i].plink.split(',')[1].split('&')[0]));
			}	
			$('.miniloader').hide();		
		});
	},
	sizeclick: function(e){
		SIZESARRAY = [];
		for(let i = 0; i < $('.sizescheck').size(); i++){
		    if($('.sizescheck:eq('+i+')').is(":checked")){
		    	SIZESARRAY.push({a:$('.sizescheck:eq('+i+')').is(":checked"), b:$('.sizescheck:eq('+i+')').attr('id') });
		    }
		}
		return SIZESARRAY
	},
	parsedata: function(){
		var tovardata = {
			title: [
				$('#example-text-input-RU').val(),
				$('#example-text-input-UA').val(),
				$('#example-text-input-EN').val()
			],
			text: [
				$('#home1 .note-editable').html(),
				$('#profile1 .note-editable').html(),
				$('#contact1 .note-editable').html()
			],
			link: $('#linkData').val(),
			images: TOVARIMAGE,
			code: $("#tovarCode").val(),
			size: CATALOG.sizeclick(),
			price: parseInt($('#priceData').val()),
			categories: parseInt($('#categoriesSelect').val()),
			type: $('#typeSelect').val(),
			color: $('#colorSelect').val(),
			group: 0,
			sale: [$('#saleEnables').is(":checked"), parseInt($('#saleData').val())],
			manufacturer: $('#manSelect').val(),
		}
		return tovardata
	},
	add: function(){
		$('.preloaderBlock').fadeIn(100);
		$.post('/addTovar',CATALOG.parsedata(), (res) => {
			create_alert(res, false);

		})
	},
	save: function(a){
		$('.preloaderBlock').fadeIn(100);
		$.post('/saveTovar',{a:CATALOG.parsedata(), b:a}, (res) => {
			create_alert(res, false);
		})
	},	
	remove: function(a){
		$('.preloaderBlock').fadeIn(100);
		$.post('/removeTovar',{a:a}, (res) => {
			create_alert(res, false);
		})
	},
	import: function(){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', $("#linkInp").val(), false);
		xhr.send();
		if (xhr.status != 200) {
		  alert( xhr.status + ': ' + xhr.statusText );
		} else {
		  alert( xhr.responseText );
		}
	},
	fileimport: function(input){
		var fileTypes = ['xml', 'json'];  
	 	if (input.files && input.files[0]) {
	        var extension = input.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
	            isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
	            console.log(extension);
	        if (isSuccess) { //yes
	            var reader = new FileReader();
	            reader.onload = function (e) {
	            	
	            	if(extension === 'xml'){
	            		var OPENED_XML = new DOMParser().parseFromString(reader.result, 'text/xml');
	            		JSON_FILE = xmlToJson(OPENED_XML);
	            		console.log(JSON_FILE)
	            		if(JSON_FILE.yml_catalog.shop.company === 'Berezkashop'){
	            			var tovarList = JSON_FILE.yml_catalog.shop.offers.offer
	            			for(var i = 0; i < tovarList.length; i++){
	       //      				var tovardata = {
								// 	title: [
								// 		tovarList[i].name,
								// 		tovarList[i].name,
								// 		tovarList[i].name
								// 	],
								// 	text: [
								// 		tovarList[i].name,
								// 		tovarList[i].name,
								// 		tovarList[i].name
								// 	],
								// 	link: $('#linkData').val(),
								// 	images: TOVARIMAGE,
								// 	code: $("#tovarCode").val(),
								// 	size: [tovarList[i].param[0]],
								// 	price: tovarList[i].price,
								// 	categories: parseInt($('#categoriesSelect').val()),
								// 	type: $('#typeSelect').val(),
								// 	color: $('#colorSelect').val(),
								// 	group: 0,
								// 	sale: [$('#saleEnables').is(":checked"), parseInt($('#saleData').val())],
								// 	manufacturer: $('#manSelect').val(),
								// }

	            				console.log(tovarList[i])
	            			}
	            		}
	            	} else if(extension === 'json'){
	            		JSON_FILE === JSON.parse(reader.result)
	            		console.log(JSON_FILE);
	            	} else{
	            		console.warn('неподдерживаемый формат файла')
	            	}
	            }
	            reader.readAsText(input.files[0]);		        
	        }
	        else { //no
	        	console.warn('Ошибка загрузки файла');
	        }
	    }
	}
}

var MENU = {
	PODLINK: null,
	TYPE: null,
	CATEGORIES: null,
	clickcategoty: function(a,b,c,d){
		$(".preloaderBlock,#datatabletype").show();
		$("#createType").hide();
		$( ".checkradio" ).prop( "checked", false );
		$( ".checkradio:eq("+a+")" ).prop( "checked", true );	
		if(b){
			$.post('/gettypes',{a:c}, (res) => {
				MENU.PODLINK = res.data.podlink;
				MENU.CATEGORIES = res.data.categories;
				$("#typestable tbody").empty();
				if(res.data.podlink[0] === '/'){
					$("#typestable tbody").empty().append('<td class="bg-danger">В данной категории нету типов</td><td class="bg-danger">В данной категории нету типов</td><td class="bg-danger">В данной категории нету типов</td>!');
					$("#createType").show();
				}else{
					for(let i  = 0; i < res.data.podlink.length; i++){
						$("#typestable tbody").append(
							'<tr onclick="MENU.clicktype('+i+')">'+
							'<td class="table-light">'+res.data.podlink[i].pname[0]+'</td>'+
							'<td class="table-light"><a href="'+res.data.podlink[i].plink+'">'+res.data.podlink[i].plink+'</a></td>'+
							'<td class="table-light">'+res.data.podlink[i].types+'</td>'+
							'</tr>'
						);
					}
				}				
				$("#createType").show();				
				$(".preloaderBlock").hide();
			});	
		}else{
			$("#typestable tbody").empty().append('<td class="bg-danger">В данной категорие нету типов</td><td class="bg-danger">В данной категорие нету типов</td><td class="bg-danger">В данной категорие нету типов</td>!');
			$("#createType,#datatabletype").hide();
			$("#setting").hide(300);
			$(".preloaderBlock").hide();
		}			
	},
	clicktype: function(a){
		$("#name-RU").val(MENU.PODLINK[a].pname[0]);
		$("#name-UA").val(MENU.PODLINK[a].pname[1]);
		$("#name-EN").val(MENU.PODLINK[a].pname[2]);
		$("#URL").val(MENU.PODLINK[a].plink);
		$("#TYPE").val(MENU.PODLINK[a].types);
		MENU.TYPE = MENU.PODLINK[a].types;
		$("#setting").fadeIn(300);
	},
	keyrusup: function(){
		$('#types-new').val(rus_to_latin($("#pname-RU-new").val().toLowerCase()));
		$('#plink-new').val('/shop?c='+MENU.CATEGORIES+','+rus_to_latin($("#pname-RU-new").val().toLowerCase())+'&page=1');
	},
	saveeditpodlink: function(){
		var PL = {
			pname: [
				$("#name-RU").val(),
				$("#name-UA").val(),
				$("#name-EN").val()
			],
			plink: $("#URL").val(),
			types: $("#TYPE").val()
		};
		$.post('/saveeditlink',{a: PL, b: MENU.CATEGORIES} , (res) => {
			create_alert(res, false)
		});
	},
	savenewcategory: function(){
		var NC = {
			name: [
				$("#name-RU-new").val(),
				$("#name-UA-new").val(),
				$("#name-EN-new").val()
			],
			glink: $("#link-new").val()
		};
		$.post('/addcategory',NC , (res) => {
			create_alert(res, false)
		});
	},
	savenewtype: function(){
		var NT = {
			pname: [
				$("#pname-RU-new").val(),
				$("#pname-UA-new").val(),
				$("#pname-EN-new").val()
			],
			plink: $("#plink-new").val(),
			types: $("#types-new").val()
		};
		$.post('/addtype',{a:NT, b: MENU.CATEGORIES }, (res) => {
			create_alert(res, false)
		});
	},
	removecategory: function(a){
		$.post('/removecategory',{a:a}, (res) => {
			create_alert(res, false)
		});
	}
}