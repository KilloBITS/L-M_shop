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

var USER = {
	block: function(a, b){
		$('.preloaderBlock').fadeIn(100);
		$.post('/blockUser',{a:a, b:b},(res) => {
			create_alert(res, false)
		})
	},
	edit: function(a){
		$('.preloaderBlock').fadeIn(100);
		$.post('/editUserData',{a:a},(res) => {
			create_alert(res, false)
		})
	},
	delete: function(a){
		$('.preloaderBlock').fadeIn(100);
		$.post('/deleteUser',{a:a},(res) => {
			create_alert(res, false)
		})
	},
	setadmin: function(a, b){
		$('.preloaderBlock').fadeIn(100);
		$.post('/setAdmUser',{a:a, b: b},(res) => {
			create_alert(res, false)
		})
	}
}