/**	@MONEY FORMAT
	@USAGE value.formatMoney(2,',','.');
*************************************************** **/
	Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
		var n = this,
		decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
		decSeparator = decSeparator == undefined ? "." : decSeparator,
		thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
		sign = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
		return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
	};


/**	@SHOP CONTAINER (scroll, size)
*************************************************** **/
	if(jQuery("#iscrollWrapper").length > 0) {

		// @RESIZE SHOP BY ITEMS
		var _itemWidth 	= jQuery("#scroller .item").width();
		var _shopItems 	= jQuery("#scroller .item").length;
		var _shopWidth	= _shopItems * _itemWidth;
		var _shopHeight	= jQuery("#scroller .item").height();
		if(_shopItems > 8) {
			_shopWidth = Math.ceil(parseInt(_shopItems) / 2) * parseInt(_itemWidth) + (10 * parseInt(_shopItems)); //Math.ceil(parseInt(_shopWidth) / 2);
			_shopHeight = parseInt(_shopHeight) * 2;
		}
		jQuery("#scroller").width(_shopWidth);
		jQuery("#scroller , #iscrollWrapper").css({"min-height":_shopHeight+"px"});
		jQuery("#scroller h3 , #scroller h4").addClass("animated fadeInUp");

		// iScroll
		var shopScroll;
		shopScroll = new IScroll('#iscrollWrapper', { 
								eventPassthrough: true, 
								scrollX: true, 
								scrollY: false,
								indicators: {
									el: document.getElementById('indicator'),
									resize: false
								},
								mouseWheel: false, 
								click: true
						});

	}


/**	@SHOP DRAG INFO
*************************************************** **/
	// Stop image dragging
	jQuery('#scroller .item').on('dragstart', function(e) {
		e.preventDefault() 
	});

	// Hide info on click & add to cookie for next visit to autohide.
	jQuery("#dragInfo").bind("click", function() { // hide info
		jQuery(this).fadeOut(400);
		// addCookie('dragInfo', true, 31);
	});
	// hide on load if this is not first vizit
	if(readCookie('dragInfo')) {
		// jQuery("#dragInfo").remove();
	}



/**	@SHOW|HIDE PRODUCT
*************************************************** **/
	jQuery("a.itemHref").bind("click", function(e) {

		if(!jQuery("#scroller").hasClass("nodrag")) {

			e.preventDefault();

			var _href = jQuery(this).attr('href');

			jQuery.scrollTo('#shop', 1500, {easing:'easeOutQuart', offset:-60});				// scroll to #shop
			jQuery("body").append('<div id="whiteOverlay" onclick="closeProduct()"></div>'); 	// add overlay
			var hash = jQuery(this).attr('href');												// get href
			window.location.hash = hash;														// change hash

			jQuery("#productContent").empty().load(_href, function() {

				// LOCAL LOAD - DELETE ON PRODUCTION --------------------------------------------------------------------------------------------------------
				if(document.location.protocol === 'file:') {
					if(!window.product_ajax) {
						jQuery("#productContent").append('<h4 class="bold">Ajax load do not work on files, please upload it to a server.</h4>' + _href);
					} else {
						jQuery("#productContent").append(window.product_ajax);
					}
				}
				// ------------------------------------------------------------------------------------------------------------------------------------------

				jQuery("#product_info").fadeIn(300);											// fade in product window

				imageZoomOnPlace();
				productImages();
				addToCart();

			});

		}
	});

	// hide product info
	jQuery("#closeProduct").bind("click", function(e) {
		e.preventDefault();
		closeProduct();
	});
	// hide product info on 'esc' key
	document.onkeydown = function(evt) {
		evt = evt || window.event;
		if (evt.keyCode == 27) {
			if(jQuery("#product_info").is(":visible")) {
				closeProduct();
			}
		}
	};
	// Close product
	function closeProduct() {
		jQuery("#product_info").fadeOut(300);
		jQuery("#whiteOverlay").remove();
		jQuery.scrollTo('#shop', 300, {easing:'easeOutQuart', offset:-60} );
		window.location.hash = '#shop';
	}

	
	
	
/**	@BUTTON [ADD TO CART]
*************************************************** **/
	function addToCart() {

		jQuery("#addToCartBtn").bind("click", function(e) {

			// if we have no #cart , process as a normal form (post or get variables (qty, etc) directly to cart page)
			if(jQuery("#cart").length > 0) { // shop-without-cart.html  - go directly to cart

				e.preventDefault();

				var product_code 	= jQuery("#product_code").val(),
					product_color 	= jQuery("#product_color").val(),
					product_size 	= jQuery("#product_size").val(),
					product_qty 	= jQuery("#product_qty").val();

				if(parseInt(product_qty) < 1) {
					var product_qty = 1;
				}

				if(product_code == '') {
					alert('Internal Error: product_code emnpty!');
				}


				// LOCAL LOAD - DELETE ON PRODUCTION --------------------------------------------------------------------------------------------------------
				if(document.location.protocol === 'file:') {
					jQuery("#cart").show();
					jQuery("#product_info").fadeOut(300);
					jQuery("#whiteOverlay").remove();
					jQuery("#cart").removeClass('hide');
					jQuery.scrollTo('#cart', 1500, {easing:'easeOutQuart'});
					window.location.hash = '#cart';
					return false;
				}
				// ------------------------------------------------------------------------------------------------------------------------------------------


				// AJAX POST 
				$.ajax({
					url: 	jQuery("#productDescription").attr('action'),
					data: 	{ajax:"true", action:jQuery("#product_action").val(), product_code:product_code, product_color:product_color, product_size:product_size, product_qty:product_qty},
					type: 	jQuery("#productDescription").attr('method'),
					error: 	function(XMLHttpRequest, textStatus, errorThrown) {
						alert('[404] Server Internal Error'); // usualy on header 404
					},
					success: function(data) {
						data = data.trim();
						// add item to cart

						jQuery("#cart").show();
						jQuery("#product_info").fadeOut(300);
						jQuery("#whiteOverlay").remove();
						jQuery("#cart").removeClass('hide');
						jQuery.scrollTo('#cart', 1500, {easing:'easeOutQuart'});
						window.location.hash = '#cart';
					}
				});

			}

		});

	}

	
	
	
/**	@BUTTON [REMOVE FROM CART]
*************************************************** **/
	jQuery("a.remove_item").bind("click", function(e){
		e.preventDefault();

		var itemCode = jQuery(this).attr('data-itemcode');
		$.ajax({
			url: 	jQuery("#productDescription").attr('action'),	// PHP URL TO REMOVE FROM CART SESSION
			data: 	{ajax:"true", action:'cart_del', itemCode:itemCode},
			type: 	'post',
			error: 	function(XMLHttpRequest, textStatus, errorThrown) {
				alert('[404] Server Internal Error'); // usualy on header 404
			},
			success: function(data) {
				jQuery("#"+itemCode).slideUp(150, function() {
					jQuery(this).remove(); // remove item from cart

					// Hide #cart if no items && go to #shop section
					if(jQuery("#cartContent .item").length < 2) { // 2 - because first one is cart header (.item.head)
						jQuery("#cart").slideUp(300, function() {
							jQuery.scrollTo('#shop', 300, {easing:'easeOutQuart'} );
						});
					}
					
					if(jQuery("#cartContent .item").length < 2 && !jQuery("#cart").hasClass('autohide')) {
						jQuery("#cartEmpty").slideDown(300);
					}

					updateCart();
				});
			}
		});
	});
	
	
	
	
/**	@SHOP CART
*************************************************** **/
	// Change Quantity
	jQuery("#cart div.qty input").bind("keyup", function() {
		var qty 		= parseInt(jQuery(this).val()),
			itemCode 	= jQuery(this).attr('data-itemcode'),
			unitPrice 	= jQuery(this).attr('data-unitprice');

		// check if quantity is valid (> 0)
		if(qty < 1) {
			qty = 1;
			jQuery(this).val(qty);
		}

		// Update new price
		var newPrice = qty * unitPrice;
		jQuery(this).parent().parent().find('div.total_price span').empty().append(newPrice.formatMoney(2,',','.'));

		// Update Cart
		updateCart();
	});

	// @UPDATE CART
	function updateCart() {

		// totalToPay = global
		window.totalToPay	= 0;

		// CALCULATE TOTAL PRICE (total to pay)
		jQuery("#cart div.qty input").each(function() {
			var _qty 			= parseInt(jQuery(this).val()),
				_itemCode 		= jQuery(this).attr('data-itemcode'),
				_unitPrice 		= jQuery(this).attr('data-unitprice'),
				_price 			= _qty * _unitPrice;

			// totalToPay = global
			window.totalToPay   = window.totalToPay + parseInt(_price);	

			// update total price
			var _TOTAL_ = parseInt(jQuery("#shipping").html()) + window.totalToPay;
			jQuery("#total_payment").empty().append(_TOTAL_.formatMoney(2,',','.'));
			jQuery("#amount").val(_TOTAL_.formatMoney(2,',','.'));

		});

	}
	// recalculate on load - just in case.
	jQuery(document).ready(function() {
		updateCart();
	});


	
	
	
/**	@CART PAYMENT METHOD
*************************************************** **/
	jQuery("#paymentMethod ul li a").bind("click", function(e) {
		e.preventDefault();

		// button - set active
		jQuery("#paymentMethod ul li a").removeClass('on');
		jQuery(this).addClass('on');

		// set visible
		var href = jQuery(this).attr('href');
		jQuery("#paymentMethod div.tab").addClass('hide');
		jQuery(href).removeClass('hide');

		jQuery("#payment_method").val(href.replace('#', ''));
		
	});


	
/**	@SHOP PRODUCT
*************************************************** **/
	function imageZoomOnPlace() {
		if(jQuery().zoom && jQuery('#zoom').length > 0) {
			jQuery('#zoom').zoom();
		}
	}	imageZoomOnPlace();

	
	
/**	@PRODUCT IMAGES
*************************************************** **/
	function productImages() {

		jQuery("#thumbnails a").bind("click", function(e) {
			e.preventDefault();

			// Mark this selected
			jQuery("#thumbnails a").removeClass('on');
			jQuery(this).addClass('on');

			// get big image path
			var imgSrc = jQuery(this).attr('href');

			// simple switch image
			jQuery("#productBigImage").fadeOut(300, function() {
				jQuery(this).attr('src', imgSrc);
				jQuery(this).fadeIn(300, function() {
					imageZoomOnPlace();
				});
			});
		});

	}	productImages();



/**	@SHOP ITEMS MOUSEOVER
*************************************************** **/
	function shopMouseOver(container, childs) {

		if(jQuery(container).length > 0) {

			var $container	= jQuery(container),
				$items		= $container.children(childs),
				timeout;

			$items.on('mouseenter', function(e) {

				var $article = jQuery(this);
				clearTimeout(timeout);
				timeout = setTimeout(function() {

					if($article.hasClass('active')) { 
						return false;
					}

					$items.not($article.removeClass('blur').addClass('active')).removeClass('active').addClass('blur');

				}, 65);
				
			});

			$container.on('mouseleave', function(e) {
				clearTimeout(timeout);
				$items.removeClass('active blur');
			});

		}

	}	shopMouseOver('#scroller.nodrag', '.item');



/**	@LOAD MORE
*************************************************** **/
	function loadmore() {
		jQuery("a.loadmore").bind("click", function(e) {
			e.preventDefault();

			var _href 		= jQuery(this).attr('href');

			if(_href == '#') {
				return false;
			}


			// random id
			var randomID = 'rand_' + Math.floor((Math.random()*999999)+1);

			// add loader
			var btnPrevContent = jQuery("a.loadmore").html();
			jQuery("a.loadmore").empty().append('<span id="loader"></span>');

			// LOCAL LOAD - DELETE ON PRODUCTION --------------------------------------------------------------------------------------------------------
			if(document.location.protocol === 'file:') {
				if(!window.shop_load_more) {
					Query("#loadmore").append('<div class="clearfix"></div><div id="' + randomID + '" class="pagespace animated fadeIn"><h4 class="bold">Ajax load do not work on files, please upload it to a server.</h4>' + _href + '</div>');
				} else {
					jQuery("#loadmore").append('<div class="clearfix"></div><div id="' + randomID + '" class="pagespace animated fadeIn">' + window.shop_load_more + '</div>');
				}

				jQuery.scrollTo('#' + randomID, _scrollSpeed, {easing:'easeInOutExpo'});
				jQuery("a.loadmore").empty().append(btnPrevContent); // remove load icon, show again previous text.
				shopMouseOver('#scroller.nodrag #'+randomID, '.item');
				return false;
			}
			// ------------------------------------------------------------------------------------------------------------------------------------------

			$.ajax({
				url: 	_href,
				data: 	{ajax:"true"},
				type: 	'get',
				error: 	function(XMLHttpRequest, textStatus, errorThrown) {
					alert('Server Internal Error'); // usualy on headers 404
				},
				success: function(data) {
					jQuery("#loadmore").append('<div class="clearfix"></div><div id="' + randomID + '" class="pagespace animated fadeIn">' + data + '</div>');
					jQuery.scrollTo('#' + randomID, _scrollSpeed, {easing:'easeInOutExpo'});
					jQuery("a.loadmore").empty().append(btnPrevContent); // remove load icon, show again previous text.
					shopMouseOver('#scroller.nodrag #'+randomID, '.item');
				}
			});


		});
	}	loadmore();