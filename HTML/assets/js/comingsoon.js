/**	NEWSLETTER SUBSCRIBE
*************************************************** **/
jQuery("#newsletter-subscribe").bind("click", function(e) {
		e.preventDefault();

		var email 			= jQuery("#newsletter_email").val(),		// required
			captcha 		= jQuery("#newsletter_captcha").val(),		// required TO BE EMPTY if humans
			_action			= jQuery("#newsletterForm").attr('action'),	// form action URL
			_method			= jQuery("#newsletterForm").attr('method');	// form method

		// Remove error class
		jQuery("input, textarea").removeClass('err');


		// SEND VIA AJAX
		$.ajax({
			url: 	_action,
			data: 	{ajax:"true", action:'newsletter_subscribe', email:email},
			type: 	_method,
			error: 	function(XMLHttpRequest, textStatus, errorThrown) {

				alert('Server Internal Error'); // usualy on headers 404

			},

			success: function(data) {
				data = data.trim(); // remove output spaces


				// PHP RETURN: Mandatory Fields
				if(data == '_required_') {
					alert(errMsg);
				} else

				// PHP RETURN: INVALID EMAIL
				if(data == '_invalid_email_') {
					alert(errEmail);
				} else

				// VALID EMAIL
				if(data == '_ok_') {

					jQuery("#newsletter_email").val('');
					$('#newsletterModal').modal();

				} else {

					// PHPMAILER ERROR
					alert(data); 

				}
			}
		});

});