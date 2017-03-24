jQuery(document).ready(function($) {

	//initializing slider images in array, defining variable menuList
	var slider_images = ['images/slider-image.png', 'images/slider-image2.png', 'images/slider-image3.png'];
	var menuList = $("nav > ul > li");
	loadContent();


	//slider OOP
	var slider = $(".slider");
	slider = new Slider(slider);
	$(".slider span").on("click", function(){
		slider.changeBackground($(this));
	});


	//call functions
	//slider();

	if ($(window).innerWidth() >= 769) menuList.addClass('hoverDesktop');
	else menuList.addClass('clickMobile');

	$(window).on("resize", function(){
		if ($(window).innerWidth() >= 769) menuList.removeClass('clickMobile').addClass('hoverDesktop');
		else menuList.removeClass('hoverDesktop').addClass('clickMobile');
	});


	$(".mobile-icon, .mobile-close-icon").on("click", function(){

		$(".nav-wrapper").toggleClass('sidebar-nav');
		$(".mobile-nav").toggle();

	});

	menuList.on("click", function(){

		$this = $(this);
		if($this.hasClass('clickMobile')) $this.has("ul").toggleClass('slide');
	});
	
	//user clicked on next slide icon, no OOP
	/*function slider(){

		$(".slider_nav span").on("click", function(){

			$this = $(this);
			var currItem = $this.index(),
				currActive = $this.parents().children().find(".active");


			currActive.removeClass('active');
			$this.parents().children().eq(currItem).addClass('active');
			


			$(".slider").fadeOut(400, function(){

				$(this).css("background-image", "url('" + slider_images[currItem] + "')");

			}).fadeIn(400);
			
		});		
	};*/


	//OOP slider
	function Slider(slider){

		this.changeBackground = function(span){

			var active = slider.find("span.active");

			//if active span is clicked again there is no unnecessary image changing
			if (!span.hasClass('active'))
			{
				slider.fadeOut(300, function(){
					slider.css("background-image", "url(" + slider_images[span.index()] + ")")
				}).fadeIn(300);
				active.removeClass('active');
				span.addClass('active');
			}
		};
	};



	//user submitted form
	$("#contact-form").on("submit", (function(event) {
		
		event.preventDefault();

		var name = $("#name"),
			email = $("#email"),
			message = $("#message");

		name = new Item(name);
		email = new Item(email);
		message = new Item(message);

		var vName = name.validate(),
			vEmail = email.validate(),
			vMessage = message.validate();


		if (vName && vEmail && vMessage)
		{
			var contactObj = { "name" : name.content, "email" : email.content, "message" : message.content };
			JSON.stringify(contactObj);



			//AJAX pristup
			/*
			$.ajax({
				url: 'http://www.locastic.com/api/v1/fe-dev',
				type: 'POST',
				data: contactObj,

				success: function(response){
					alert("Forma uspješno poslana!");
				},

				error: function(xhr, statusText, status){
					console.log("Status greške: " + statusText);
				}
			});*/
			

			//JS
			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", 'http://www.locastic.com/api/v1/fe-dev', true);

			xhttp.onreadystatechange = function(){

				if (this.readyState == 4)
				{
					if (this.status == 200) alert("Forma uspješno poslana!");
					else console.log("Došlo je do greške...");
				}
			};
			xhttp.send(contactObj);
		}


		function Item (form_item)
		{
			form_item.prev("span").empty();
			this.id = form_item.attr("id");
			this.content = form_item.val();

			this.validate = function(){

				switch(this.id)
				{
					case "name":
						if (this.content.length < 3) 
						{
							form_item.prev("span").append("<br />Ime je prazno ili prekratko...");
							return false;
						}
						else return true;
						break;
					case "email":
						if (this.content.length < 7) 
						{
							form_item.prev("span").append("<br />Email polje prazno ili prekratko...");
							return false;
						}
						else return true;
						break;
					case "message":
						if (this.content.length < 10) 
						{
							form_item.prev("span").append("<br />Poruka je prekratka...");
							return false;
						}
						else return true;
						break;
				};
			};
		};
	}));

	//loading content (articles) from content.json
	function loadContent(){

		var template = $(".article-template").html();
		$.ajax({
			url: 'content.json',
			type: 'GET',
			dataType: 'json',

			success: function(response){

				$.each(response.articles, function(index, element){

					$(".content-wrapper").append((Mustache.render(template, element)));
				

				});
			},

			error: function(){
				console.log("error!!");
			}
		});
	};
});