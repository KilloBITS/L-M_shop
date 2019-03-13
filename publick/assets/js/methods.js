var NEWSFILELOGO = 'default.jpg';
var NEWSFILECONTENTIMAGE = ['','','','','','','',''];

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
	remove: function(a){

	}
}