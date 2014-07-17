	// @GOOGLE MAP
	var $googlemap_latitude 	= -37.812344,
		$googlemap_longitude	= 144.968900,
		$googlemap_zoom			= 13;

	var _enableAnimation		= true,							// enable|disable animation
		_scrollSpeed			= 1500;



	/**	@Fullscreen Height
	*************************************************** **/
	if(jQuery(".fullSlider").length > 0) {
		_fullscreen();

		jQuery(window).resize(function() {
			_fullscreen();
		});
	}

	function _fullscreen() {
		var _screenHeight = jQuery(window).height();
		jQuery("#home, .image-caption, .image-caption .inner, #home.homeTop.imageOnly .image-caption, #home.homeTop img").height(_screenHeight);
	}


	/**	@TOP MENU
	*************************************************** **/
	if(!jQuery("#header").hasClass('navbar-fixed-top')) { 

		window.isOnTop 		= true;
		window._continue 	= false;
		window.isHome 		= false;

		// @HOME
		if(jQuery("#home").length > 0) {

			window.isHome 		= true;
			window._continue 	= true;
			parent_bj 			= jQuery("#home");
			
		// @NOT HOME
		} else {

			var parent_section 	= jQuery("#header").parent().find('section').attr('class');
			var parent_bj		= jQuery("#header").parent().find('section');

			if(parent_section == 'pace-running' || parent_section == undefined || parent_section == '') {} else {
				window._continue 	= true;
				window.isHome 		= false;
			}

		}

		if(window._continue === true) {
			 // Check if we have a home id (home = slider)
			 if(parent_bj.length > 0) {

				window.homeHeight = parent_bj.height();

				jQuery(window).resize(function() {
					window.homeHeight = parent_bj.height();
				});

			} else {

				window.homeHeight = 0;

			}

			// Padding correction
			if(window.isHome === false && window.homeHeight > 0) {
				window.homeHeight = parent_bj.height() + 140;
			}

			 /*
				window.isOnTop = avoid bad actions on each scroll
				Benefits: no unseen jquery actions, faster rendering
			 */
			jQuery(window).scroll(function() {
				if(jQuery(document).scrollTop() > window.homeHeight) {
					if(window.isOnTop === true) {
						jQuery('#header').addClass('navbar-fixed-top');
						window.isOnTop = false;
					}
				} else {
					if(window.isOnTop === false) {
						jQuery('#header').removeClass('navbar-fixed-top');
						window.isOnTop = true;
					}
				}
			});

		}

	}



	/**	@Easy Pie Chart
	*************************************************** **/
	var pieChartClass 		= 'pieChart',
		pieChartLoadedClass = 'pie-chart-loaded';

		var chart = jQuery('.' + pieChartClass);
		chart.each(function() {
			jQuery(this).appear(function() {
				var $this = jQuery(this),
					chartBarColor = ($this.data('bar-color')) ? $this.data('bar-color') : "#3886AE",
					chartBarWidth = ($this.data('bar-width')) ? ($this.data('bar-width')) : 150
				if(!$this.hasClass(pieChartLoadedClass)) {
					$this.easyPieChart({
						animate: 	2000,
						size: 		chartBarWidth,
						lineWidth: 	2,
						scaleColor: false,
						trackColor: "#eeeeee",
						barColor: 	chartBarColor,
					}).addClass(pieChartLoadedClass);
				}
			});
		});



	/**	@Portfolio Page
	*************************************************** **/
	jQuery(".portfolio a").bind("click", function(e) {

		// if not external link
		if(!jQuery(this).hasClass('external')) {

			var _href 		= jQuery(this).attr('href'),
				isPhoto		= jQuery(this).attr('data-photo');


			// Check if already open!
			if(jQuery(this).hasClass('current')) {
				jQuery.scrollTo('#portfolioPage', _scrollSpeed, {easing:'easeInOutExpo'});
				return false;
			}

			/* Check if PrettyPhoto */
			if(isPhoto) {
				return false;
			}

			if(_href != '#') { // empty action not allowed
				e.preventDefault();

				// highlight portfolio item
				jQuery('.portfolio a').removeClass('current');
				jQuery(this).addClass('current');

				// scrollTo portfolioPage ares
				jQuery.scrollTo('#portfolioPage', _scrollSpeed, {
					easing:'easeInOutExpo', 	// easing effect
					onAfter: function() {		// scrollTo callback

						// Hide old content
						if(jQuery("#portfolioPageContainer").is(":visible")) {
							jQuery("#portfolioPageContainer").slideUp(300);
						}

						// load portfolio page
						jQuery("#portfolioPageContent").empty().load(_href, function() {


							// LOCAL LOAD - DELETE ON PRODUCTION --------------------------------------------------------------------------------------------------------
							if(document.location.protocol === 'file:') {
								var _err = '<h4 class="bold">Ajax load do not work on files, please upload it to a server.</h4>' + _href;

								if(_href == 'portfolio-fullscreen.html') {
									if(!window.product_ajax) {
										jQuery("#portfolioPageContent").append(_err);
									} else {
										jQuery("#portfolioPageContent").append(window.portfolio_fullscreen);
									}
								}

								if(_href == 'portfolio-image.html') {
									if(!window.product_ajax) {
										jQuery("#portfolioPageContent").append(_err);
									} else {
										jQuery("#portfolioPageContent").append(window.portfolio_image);
									}
								}

								if(_href == 'portfolio-video.html') {
									if(!window.product_ajax) {
										jQuery("#portfolioPageContent").append(_err);
									} else {
										jQuery("#portfolioPageContent").append(window.portfolio_video);
									}
								}

							}
							// ------------------------------------------------------------------------------------------------------------------------------------------


							// slide down portfolio page
							jQuery("#portfolioPageContainer").slideDown(300, function() {
								jQuery.scrollTo('#portfolioPageContainer', _scrollSpeed, {easing:'easeInOutExpo'});

								// @BXSLIDER
								if(jQuery('#portfolioPage .bxslider').length > 0) {

									bxsliderInit('#portfolioPage .bxslider');

								}

								// @OWL CAROUSEL
								if(jQuery('#portfolioPage .owl-carousel').length > 0) {

									owlCarouselInit('#portfolioPage .owl-carousel');

								}

								// @FITDIVS
								$("#portfolioPage").fitVids();

								// @CountTo (number animate)
								jQuery('#portfolioPage .countTo').appear(function() {
									jQuery(this).each(function() {
										var $to = parseInt(jQuery(this).html());
										jQuery(this).countTo({
											from: 				0,
											to: 				$to,
											speed: 				4000,
											refreshInterval: 	40
										});
									});
								});


								// @FULLSLIDER
								if(jQuery('.fullSlider').length) {
									fullSlider("#portfolioPageContent");
								}

							});

							jQuery.stellar('refresh');

						});

					}
				});
			} // end IF

		} // end IF not external
	});


	// Close Portfolio Page
	jQuery("a.portfolioClose").bind("click", function (e) {
		e.preventDefault();

		jQuery("#portfolioPageContainer").slideUp(300, function() {
			jQuery("#portfolioPageContent").empty();
			jQuery('.portfolio a').removeClass('current');
			jQuery.scrollTo('#portfolio', _scrollSpeed, {easing:'easeInOutExpo'});
			jQuery.stellar('refresh');
		});
	});




	/**	@Isotope Portfolio
	*************************************************** **/
	if(jQuery().isotope && jQuery('.portfolio').length > 0) {

		var $container 		= jQuery('.portfolio');
		var portfolioLayout = 'fitRows';

		$container.isotope({
			filter: '*',
			animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false
			},
			masonry: {}
		});


		jQuery('.portfolio-filter a').click(function(){
			jQuery('.portfolio-filter .current').removeClass('current');
			jQuery(this).addClass('current');
			
			var selector = jQuery(this).attr('data-filter');
			$container.isotope({
				filter: selector,
				animationEngine : "css",
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				},
				masonry: {}
			});

			jQuery.stellar('refresh');

			return false;
		});


		// Responsive
		function getColumnNumber() {
			var winWidth 		= jQuery(window).width(),
				columnNumber 	= 1;

			if (winWidth > 1200) {
				columnNumber = 3;
			} else if (winWidth > 950) {
				columnNumber = 3;
			} else if (winWidth > 600) {
				columnNumber = 2;
			} else if (winWidth > 250) {
				columnNumber = 1;
			}

			return columnNumber;
		}

		
		function setColumns() {
			var winWidth 		= jQuery("#portfolioContainer").width(), 
				columnNumber 	= getColumnNumber(), 
				itemWidth 		= Math.floor(winWidth / columnNumber);

				$container.find('.item').each(function() { 
				jQuery(this).css({ 
					width: parseInt(itemWidth - 1) + 'px' 
				});
			});
		}
		
		
		function setPortfolio() {
			setColumns();
			$container.isotope('reLayout');
		}
		
		
		$container.imagesLoaded(function () {
			setPortfolio();
		});
		
		
		jQuery(window).on('resize', function () {
			setPortfolio();          
		});

	}

	
	
	/**	@Google Map
	*************************************************** **/
	function contactMap() {
		var latLang = new google.maps.LatLng($googlemap_latitude,$googlemap_longitude);

		var mapOptions = {
			zoom:$googlemap_zoom,
			center: latLang,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(document.getElementById('gmap'), mapOptions);
		google.maps.event.trigger(map, 'resize');
		map.setZoom( map.getZoom() );

		var marker = new google.maps.Marker({
			icon: 'data:image/png;base64,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',
			position: latLang,
			map: map,
			title: ""
		});

		marker.setMap(map);
		google.maps.event.addListener(marker, "click", function() {
			// Add optionally an action for when the marker is clicked
		});

		// kepp googlemap responsive - center on resize
		google.maps.event.addDomListener(window, 'resize', function() {
			map.setCenter(latLang);
		});

	}

	
	function showMap(initWhat) {
		var script 		= document.createElement('script');
		script.type 	= 'text/javascript';
		script.src 		= 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback='+initWhat;
		document.body.appendChild(script);
	}

	
	// INIT CONTACT, NLY IF #contactMap EXISRS
	if(jQuery("#gmap").length > 0) {
		showMap('contactMap');
	}

	
	
/**	@ANIMATE ELEMENTS
*************************************************** **/
	if(jQuery().appear && _enableAnimation === true) {
		jQuery('*').each(function() {
			if(jQuery(this).attr('data-animation')) {
				var $animationName = jQuery(this).attr('data-animation');
				jQuery(this).appear(function() {
					jQuery(this).addClass('animated').addClass($animationName);
				});
			}
		});
	}

	
	
/**	@CountTo (number animate)
*************************************************** **/
	if(jQuery().appear && _enableAnimation === true) {
		if(jQuery().countTo) {
			jQuery('.countTo').appear(function() {
				jQuery(this).each(function() {
					var $to = parseInt(jQuery(this).html());
					jQuery(this).countTo({
						from: 				0,
						to: 				$to,
						speed: 				4000,
						refreshInterval: 	40
					});
				});
			});
		}
	};



/**	@Scroll To
*************************************************** **/
	jQuery("a.scrollTo").bind("click", function(e) {
		e.preventDefault();

		var href = jQuery(this).attr('href');

		if(href != '#') {
			jQuery.scrollTo(href, _scrollSpeed, {easing:'easeInOutExpo'});
		}
	});
	
	
	
/**	@FITVIDS
*************************************************** **/
	if(jQuery().fitVids) {
		$("body").fitVids();
	}

	
/**	@NICESCROLL
*************************************************** **/
	if(jQuery().niceScroll) {
		jQuery(".nicescroll").niceScroll({
			// background:"#ccc",
			scrollspeed:60,
			mousescrollstep:35,
			cursorborder:0,
			cursorcolor:"rgba(0,0,0,.6)",
			horizrailenabled:false,
			zindex:99999,
			autohidemode:false,
			cursorwidth:8
		});
	}


	/**	@Mobile Menu
	*************************************************** **/
	// bootstrap bug on resize back to full
	jQuery(window).resize(function() {
		if(jQuery("#header nav").hasClass('in')) {
			jQuery("#mobileMenu").trigger("click");
		}
	});

	
/**	@ONEPAGE NAV
*************************************************** **/
	if(jQuery().onePageNav) {
		jQuery('ul#onepageNav').onePageNav({
			currentClass: 	'active',
			easing: 		'easeInOutExpo',
			scrollSpeed:	_scrollSpeed,
			begin: function() {
				//Hack so you can click other menu items after the initial click
				jQuery('body').append('<div id="iOSHack" style="height: 1px;"></div>');
			},
			end: function() {
				jQuery('#iOSHack').remove();
			},
			scrollOffset: 60,
			changeHash: false,
			filter: ':not(.external)'
		});
	}

	
	
/**	@PRETTYPHOTO
*************************************************** **/
	if(jQuery().prettyPhoto) {
		jQuery('a[data-photo^="prettyPhoto"]').prettyPhoto({
			deeplinking:				false,
			slideshow: 					5000,
			autoplay_slideshow: 		false,
			animationSpeed: 			'fast', 			/* fast/slow/normal */
			padding: 					40, 				/* padding for each side of the picture */
			opacity: 					0.75, 				/* Value betwee 0 and 1 */
			showTitle: 					true, 				/* true/false */
			allowresize: 				true, 				/* true/false */
			counter_separator_label: 	'/', 				/* The separator for the gallery counter 1 "of" 2 */
			// theme: 						'default', 			/* default / facebook / light_rounded / dark_rounded / light_square / dark_square */
			hideflash: 					false, 				/* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
			modal: 						false, 				/* If set to true, only the close button will close the window */
			changepicturecallback: 		function(){}, 		/* Called everytime an item is shown/changed */
			callback: 					function(){} 		/* Called when prettyPhoto is closed */
		});
	}



/**	@VIDEOBG
*************************************************** **/
/*
	var videoBg = {
		mp4:'video.mp4',
		ogv:'video.ogv',
		webm:'video.webm',
		poster:'video.jpg',
		scale:true,
		zIndex:0,
		position:"absolute",
		opacity:1,
		fullscreen:true
	};
*/
	if(jQuery().videoBG && jQuery('#videoBg').length > 0) {
		jQuery('#videoBg').videoBG(videoBg);
	}

	
	
	/**	@Carousel
		@USAGE
		<div class="owl-carousel text-left" data-navigation="false" data-singleitem="true" data-autoplay="true">
			<div class="item dragCursor">#item 1</div>
			<div class="item dragCursor">#item 2</div>
			<div class="item dragCursor">#item 3</div>
			<div class="item dragCursor">#item N</div>
		</div>
	*************************************************** **/
	if(jQuery().owlCarousel) {
		owlCarouselInit(".owl-carousel");
	}

	function owlCarouselInit(divClass) {
		jQuery(divClass).each(function() {
			var t 			= jQuery(this),
				navigation 	= t.attr('data-navigation'),
				singleItem 	= t.attr('data-singleitem'),
				autoPlay 	= t.attr('data-autoplay'),

				navigation = (navigation == 'true') ? true : false,
				singleItem = (singleItem == 'true') ? true : false,
				autoPlay 	= (autoPlay == 'true') ? true : false;

			jQuery(t).owlCarousel({
				slideSpeed: 		300,
				paginationSpeed: 	400,
				navigation: 		navigation,
				singleItem: 		singleItem,
				autoPlay:			autoPlay
			});
		});
	}
	
	
/**	@PARALLAX BACKGROUNDS
*************************************************** **/
	jQuery(window).bind('load', function () {
		// parallax mode
		jQuery.stellar({
			horizontalScrolling: false,
			verticalOffset: 0
		});

		// responsive
		jQuery(window).resize(function() {
			jQuery.stellar('refresh');
		});
	});

	

/**	@ELEMENTS ANIMATION
*************************************************** **/
	jQuery('.animate_from_top').each(function () {
		jQuery(this).appear(function() {
			jQuery(this).delay(150).animate({opacity:1,top:"0px"},1000);
		});	
	});

	jQuery('.animate_from_bottom').each(function () {
		jQuery(this).appear(function() {
			jQuery(this).delay(150).animate({opacity:1,bottom:"0px"},1000);
		});	
	});


	jQuery('.animate_from_left').each(function () {
		jQuery(this).appear(function() {
			jQuery(this).delay(150).animate({opacity:1,left:"0px"},1000);
		});	
	});


	jQuery('.animate_from_right').each(function () {
		jQuery(this).appear(function() {
			jQuery(this).delay(150).animate({opacity:1,right:"0px"},1000);
		});	
	});

	jQuery('.animate_fade_in').each(function () {
		jQuery(this).appear(function() {
			jQuery(this).delay(150).animate({opacity:1,right:"0px"},1000);
		});	
	});

	
	
/**	@PROGRESSBAR ANIMATE
*************************************************** **/
	$('.bar li').each(function () {
		$(this).appear(function() {
		  $(this).animate({opacity:1,left:"0px"},1200);
		  var b = $(this).find("span").attr("data-width");
		  $(this).find("span").animate({
			width: b + "%"
		  }, 1700, "easeOutCirc");
		});	
	});



/**	@FULLSCREEN SLIDER
*************************************************** **/
	function fullSlider(sliderContainer) {

		if(jQuery(sliderContainer + " .fullSlider").length) {
			jQuery(sliderContainer + " .fullSlider").maximage({
				cycleOptions: {
					fx: 		'fade',
					speed: 		1000,
					timeout: 	0,
					prev: 		sliderContainer + ' .sliderPrev',
					next: 		sliderContainer + ' .sliderNext',
					pause: 		1,

					before: function(last,current){
						jQuery('.image-caption').fadeOut().animate({top:'100px'},{queue:false, easing: 'easeOutQuad', duration: 550});
						jQuery('.image-caption').fadeOut().animate({top:'-100px'});
					},

					after: function(last,current){
						jQuery('.image-caption').fadeIn().animate({top:'0'},{queue:false, easing: 'easeOutQuad', duration: 450});
					}	
				},

				onFirstImageLoaded: function(){
					jQuery(sliderContainer + ' .imgLoader').delay(800).hide();
					jQuery('.fullSlider').delay(800).fadeIn('slow');
					jQuery('.image-caption').fadeIn().animate({top:'0'});		
				}
			});

			// Fill and Center HTML5 Videos
			jQuery('video,object').maximage('maxcover');
		}

		// no click
		jQuery(sliderContainer + ' .sliderPrev , ' + sliderContainer + ' .sliderNext').bind("click", function(e) {
			e.preventDefault();
		});

	}

	// HOME FullSlider
	fullSlider("#home");

	// Content FullSlider
	fullSlider(".contentFullSlider");



/**	@BXSLIDER
*************************************************** **/
	function bxsliderInit(divSlider) {

		if(jQuery().bxSlider) {

			jQuery(divSlider).bxSlider({
				controls: true, 
				pager: false,		
				auto:true,
				mode: 'fade',
				speed: 800,
				pause: 3000,
				preloadImages:'all'
			});

		}

	}	bxsliderInit('.bxslider');





/**	@TOP SLIDER
*************************************************** **/
	function topSliderInit(divSlider) {

		if(jQuery().bxSlider) {

			jQuery(divSlider).bxSlider({
				controls: true, 
				pager: false,		
				auto:false,
				mode: 'fade',
				speed: 800,
				video: true,
				adaptiveHeight: true
			});

		}

	}	topSliderInit('.topSlider');




/**	@Cookies
*************************************************** **/
	function addCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function delCookie(name) {
		addCookie(name,"",-1);
	}


/**	@Facebook
*************************************************** **/
	/*
		https://developers.facebook.com/docs/plugins/like-button/

		ADD TO YOUR CODE (just change data-href, that's all):

		<div class="fb-like" data-href="https://developers.facebook.com/docs/plugins/" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
	*/
	if(jQuery("div.fb-like").length > 0) {

		jQuery('body').append('<div id="fb-root"></div>');

		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

	}

/**	@Google Plus
*************************************************** **/
	/*
		https://developers.google.com/+/web/+1button/

		<!-- Place this tag where you want the +1 button to render. -->
		<div class="g-plusone" data-size="medium" data-annotation="inline" data-width="300"></div>
	*/
	if(jQuery("div.g-plusone").length > 0) {

		(function() {
			var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			po.src = 'https://apis.google.com/js/platform.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		})();

	}

/**	@Twitter
*************************************************** **/
	/*
		https://dev.twitter.com/docs/tweet-button

		<!-- Place this tag where you want the twitter button to render. -->
		<a href="https://twitter.com/share" class="twitter-share-button" data-lang="en">Tweet</a>
	*/
	if(jQuery("a.twitter-share-button").length > 0) {

		!function(d,s,id){
			var js,fjs=d.getElementsByTagName(s)[0];
			if(!d.getElementById(id)){js=d.createElement(s);
			js.id=id;js.src="https://platform.twitter.com/widgets.js";
			fjs.parentNode.insertBefore(js,fjs);}
		}(document,"script","twitter-wjs");

	}