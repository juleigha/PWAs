$(document).ready(function() {
	//dynamic shadows & custom events define  
	var staticLight = 200;
	const approaching = new Event('load:Img');
	const receding  = new Event('unload:Img');
	// scroll to last viewed img
	var lastPane =  ( localStorage.getItem("LastPane") == "null" || localStorage.getItem("LastPane") == null )? "pane0" : localStorage.getItem("LastPane") ;
	document.querySelector("[pane-ID="+lastPane+"]").scrollIntoView();
	$("[pane-ID="+lastPane+"]").attr("src",$("[pane-ID="+lastPane+"]").attr("pane-src"));
	var imgs = $(".comic-wrapper img");
	
	//events
	//save last img viewed & darken bg if at top 
	$(document).scroll(function(){
		changeLigt();
		$("body .overlay").css("opacity",window.pageYOffset/600);
		if($(document).scrollTop() % 100 < 10){
			for(var i = 0; i<imgs.length;i++){
				if(Math.abs(imgs[i].getBoundingClientRect().y) < 300){
					if (! $("#contentsTable").hasClass("Active")){
						lastPane = imgs[i].getAttribute("pane-ID");
						localStorage.setItem("LastPane",lastPane);

					}
				}
				if(Math.abs(imgs[i].getBoundingClientRect().y) < 3500){
					imgs[i].dispatchEvent(approaching);
				}
			}
		}

	});
	// nav btns 
		// toggle nav 
	$(".chapter-btn").click(function(){
		if($("#contentsTable").hasClass("Active")){
			closeContents(document.querySelector("[pane-ID="+lastPane+"]"));
		}
		else{
			openContents();
		}
	})
	// navigate story 
	$("#contentsTable li a").click(function(e){
		e.preventDefault();
		var id = $(this).attr("data-scroll");
		document.getElementById(id).children[0].children[0].dispatchEvent(approaching);
		closeContents(((document.getElementById(id)).previousElementSibling).previousElementSibling);
	})
	// approaching custom event
	$("img").on('load:Img',function(){
		$(this).attr("src",$(this).attr("pane-src"));
	})
	
// events functions
function closeContents(element){
	$(".chapter-btn").text("Chapters");
	$("#contentsTable").removeClass("Active");
	$("nav").removeClass("fixed");
	$("html").removeClass("fixed");
	ScrollToElem(element);
}
function ScrollToElem(element) {
	element.scrollIntoView();
	setTimeout(function(){
		$("#contentsTable").removeClass("Active");
		$(document).trigger("scroll");
	},600);
}
function openContents(){
	$(".chapter-btn").text("Close");
	$("#contentsTable").addClass("Active");
	$("nav").addClass("fixed");
	$("html").removeClass("fixed");
}
//close nav on esc key 
$(document).keyup(function(e) {
	if(e.key === "Escape"){
		closeContents(document.querySelector("[pane-ID="+lastPane+"]"));
	}
})
// dopwnload chap request -> by sw js 
$(".dnldBtn").click(e=>{
	var pages = $(e.target).next("ul").children();
	console.log(pages);
	for (var i = 0; i < pages.length; i++) {
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "appDownloadChapter/"+$($(pages[i]).children("img")[0]).attr("pane-src"), true);
		xhttp.send();
	}
})
// dynamic shadows 
function changeLight() {
	var shadowBlur;
	var shadowRGB = "rgba(0, 0, 0, 0.8)";
	var lightSource = window.pageYOffset + staticLight ;
	$(".lightSource-shadow").each(function() {
		var shadowOffSet = (this.offsetTop - window.pageYOffset - staticLight) / 35;
		$(this).css("box-shadow","0px "+(shadowOffSet)+"px 7px rgba(0, 0, 0, 0.50)" );
	})
}
});
