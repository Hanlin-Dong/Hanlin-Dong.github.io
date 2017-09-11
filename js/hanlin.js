$(document).ready(function(){
	$("table").addClass("table");
	$("thead").addClass("thead-default");
	$("article").find("h2,h3,h4").each(function(i, element){
		var head = $(element).text();
		var tag = element.tagName;
		var prefix = "";
		var navclass = "";
		if (tag == "H2")
		{
			navclass = "nava-1";
		} else if (tag == "H3")
		{
			navclass = "nava-2";
		} else if (tag == "H4") {
			navclass = "nava-3";
		}
		var navhref = $(element).attr("id");
		var navtext = $(element).text();
		$("#nav").append('<li class="'+navclass+'"><a href="#'+navhref+'">'+navtext+'</a></li>');
		console.log('<a href="#'+navhref+'" class="'+navclass+'"><li>'+navtext+'</li></a>');
	})
	$("#nav").onePageNav();
	var myElementLineCount = 4;
	var defaultDisplayRow = 1;
	if ($(window).width() >= 960) {
		$(".card-mywrapper").each(function(i, element){
			var cards = $(element).children(".card-myelement");
			while (cards.length >= myElementLineCount) {
				$(cards.splice(0, myElementLineCount)).wrapAll($("<div></div>").addClass("card-deck py-2"));
			}
			if (myElementLineCount == 4) {
				var numleft = cards.length;
				$(cards).wrapAll($('<div class="row"></div>')).wrapAll($('<div class="col-'+3*numleft+'"></div>').addClass("card-deck py-2 mx-0 px-0"));
			}
		});
		$(".card-mywrapper").each(function(i, element){
			var nodeck = $(element).find(".card-deck").length;
			if (nodeck > 1) {
				$(element).prev().children(".my-collapse").show();
			}
			$(element).find(".card-deck:first .card-myelement").each(function(j, element){
				$(element).addClass("my-default-show").show();
			})
		});
	} else {
		$(".card-mywrapper").each(function(i, element){
			$(element).children(".card-myelement:lt(3)").show();
			if (!$(element).children(".card-myelement:last").is(":visible")) {
				$(element).prev().children(".my-collapse").show();
			}
		});
	}
	
	$(".my-collapse").click(function(){
		if ($(this).data("collapsed")) {
			$(this).parent().next().find(".card-myelement:not(.my-default-show)").slideUp();
			$(this).data("collapsed", false);
			$(this).find("a").text("展开全部").prepend('<i class="fa fa-angle-double-down"></i>');
		} else {
			$(this).parent().next().find(".card-myelement").slideDown();
			$(this).data("collapsed", true);
			$(this).find("a").text("收起全部").prepend('<i class="fa fa-angle-double-up"></i>');
		}
	})
	$(".card-myelement").mouseover(function(){
		$(this).addClass("bg-light");
	});
	$(".card-myelement").mouseout(function(){
		$(this).removeClass("bg-light");
	})
});
