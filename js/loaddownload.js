$(document).ready(function(){
	$(".downloadpage").children().each(function(i, element){
		if ($(element).hasClass("markdown")) {
			var markdown = $(element).text();
			$(element).html(marked(markdown));
		}
	})
})