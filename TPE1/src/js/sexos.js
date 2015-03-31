//set opacity to 0.4 for all the images
//opacity = 1 - completely opaque
//opacity = 0 - invisible
$(document).ready(function() {
	$('.thumbnail img').css('opacity', 1);

	// when hover over the selected image change the opacity to 1
	$('.thumbnail').hover(function() {
		$(this).find('img').stop().fadeTo('slow', 0.6);
	}, function() {
		$(this).find('img').stop().fadeTo('slow', 1);
	});
});
