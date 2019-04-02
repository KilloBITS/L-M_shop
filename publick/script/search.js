$("#SEARCH").on("keyup", function() {
  if ($("#SEARCH").val().length > 3) {
    $(".search_result").fadeIn(150);
    $.post("/search", {
      name: $("#SEARCH").val()
    }, function(result) {
      console.log(result.searchResult);
      var res = result.searchResult;
      $('.search_data div').remove();
      $(".search_title span").html(res.length)
      for(let i = 0; i < res.length; i++){
        console.log(res[i])
        var newObj = document.createElement('div');
        newObj.className = 'search_object';            
        $('.search_data').append(newObj);

        var obImg =  document.createElement('div');
        obImg.className = 'search_min_img';            
        $(newObj).append(obImg);

        var img =  document.createElement('img');
        img.id = 'TovImg'+i;   
        img.setAttribute('src', res[i].images[0]);         
        $(obImg).append(img);

        var obTitle =  document.createElement('div');
        obTitle.className = 'search_min_title';
        obTitle.innerHTML = res[i].title[pageLang];
        $(newObj).append(obTitle);
      }
    });
  } else {
    $(".search_result").fadeOut(150);
  }
});

var clearSearch = function(){
  $('.search_data div').remove();
  $(".search_title span").html('0');
  $(".search_result").fadeOut(150);
  $("#SEARCH").val('')
}