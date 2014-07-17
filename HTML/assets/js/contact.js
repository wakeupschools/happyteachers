/**	@Contact
*************************************************** **/
// @CONTACT FORM - TRANSLATE OR EDIT
var errMsg 					= 'Please complete all fields!',
	errEmail				= 'Invalid Email!',
	okSent					= '<strong>Thank You!</strong> Message sent!';


// @GOOGLE MAP UNCOVER
jQuery("a.gmapShow").bind("click", function(e) {
	e.preventDefault();

	jQuery('#gmap').css({"z-index":"101"});
	jQuery('#footerContent').css({"opacity":"0"});
	jQuery('a.gmapClose').fadeIn(500);
});

// @GOOGLE MAP COVER
jQuery("a.gmapClose").bind("click", function(e) {
	e.preventDefault();

	jQuery('#gmap').css({"z-index":"1"});
	jQuery('#footerContent').css({"opacity":"1"});
	jQuery('a.gmapClose').fadeOut(500);
});

// @VALIDATE && SEND
jQuery("#emailForm button").bind("click", function(e) {
	e.preventDefault();

	// hide alerts && remove red border error
	jQuery("#alertErr , #alertOk").hide();
	jQuery("input.err , textarea.err").removeClass('err');

	var t 			= jQuery(this),
		_name		= jQuery("#name").val(),
		_email		= jQuery("#email").val(),
		_message	= jQuery("#message").val(),
		err 		= false;

	// check name
	if(_name.trim() == '') {
		err = true;
		jQuery("#name").addClass('err');
	}
	// check email
	if(_email.trim() == '') {
		err = true;
		jQuery("#email").addClass('err');
	}
	// check message
	if(_message.trim() == '') {
		err = true;
		jQuery("#message").addClass('err');
	}

	// print error if any
	if(err == true) {
		jQuery("#alertErrResponse").empty().append(errMsg);
		jQuery("#alertErr").show();
	}

	// AJAX POST 
	$.ajax({
		url: 	jQuery("#emailForm").attr('action'),
		data: 	{ajax:"true", action:'email_send', name:_name, email:_email, message:_message},
		type: 	jQuery("#emailForm").attr('method'),
		error: 	function(XMLHttpRequest, textStatus, errorThrown) {
			jQuery("#alertErrResponse").empty().append('Server Internal Error'); // usualy on headers 404
			jQuery("#alertErr").show();
		},
		success: function(data) {
			data = data.trim();

			// PHP RETURN: Mandatory Fields
			if(data == '_required_') {
				jQuery("#alertErrResponse").empty().append(errMsg);
				jQuery("#alertErr").show();
			} else

			// PHP RETURN: INVALID EMAIL
			if(data == '_invalid_email_') {
				jQuery("#alertErrResponse").empty().append(errEmail);
				jQuery("#alertErr").show();
			} else

			// PHP RETURN: INVALID EMAIL
			if(data == '_sent_ok_') {

				// hide error warning if visible
				jQuery("#alertErr").hide();

				// append message and show ok alert
				jQuery("#alertOkResponse").empty().append(okSent);
				jQuery("#alertOk").show();

				// reset form
				jQuery("#name, #email, #message").val('');

			} else {

				// PHPMAILER ERROR
				jQuery("#alertErrResponse").empty().append(data);
				jQuery("#alertErr").show();

			}
		}
	});

});

// remove error (red border) when user start typing
jQuery("input, textarea").bind("keyup", function() {
	jQuery(this).removeClass('err');
});