function getGET() {
	var loc = document.location.href;
	var getString = loc.split('?')[1];
	var getString2 = getString.split('#')[0];
	var GET = getString2.split('&');
	var get = {};
	//this object will be filled with the key-value pairs and returned.

	for (var i = 0, l = GET.length; i < l; i++) {
		var tmp = GET[i].split('=');
		get[tmp[0]] = unescape(decodeURI(tmp[1]));
	}
	return get;
}


$('#backtosearch').on("click", function() {
	window.history.back();
});

function loadDescription(data, i) {
	if (data.product.attributes[i].name == 'Marca' || data.product.attributes[i].name.substring(0, 9) == 'Material-' || data.product.attributes[i].name == 'Ocasion' || data.product.attributes[i].name == 'Genero' || data.product.attributes[i].name == 'Edad') {
		var rta = "";
		for (var j = 0; j < data.product.attributes[i].values.length; j++) {
			rta += data.product.attributes[i].values[j];
			rta += ", ";
		}
		rta = rta.substring(0, rta.length - 2);
		var rta = rta;
		var selector = (data.product.attributes[i].name.substring(0, 9) == 'Material-') ? '#material' : '#' + data.product.attributes[i].name.toLowerCase();
		$(selector).append(rta);
	}
	return;
}

function loadOptions(data, i) {
	if (data.product.attributes[i].name.substring(0, 5) == 'Talle' || data.product.attributes[i].name == 'Color') {
		for (var j = 0; j < data.product.attributes[i].values.length; j++) {
			var rta = $('<option>' + data.product.attributes[i].values[j] + '</option>');
			var selector = (data.product.attributes[i].name.substring(0, 5) == 'Talle') ? '#talle' : '#color';
			$(selector).append(rta);
		}
	}
	if (data.product.attributes[i].name.substring(0, 5) == 'Talle')
		return 1;
	// TOCO MISHU PARA ARREGLAR CUANDO NO HAY TALLE
}

var get = getGET();
// DEJAR AFUERA (preguntar a mishu y dinu)

$(document).ready(function() {

	$.ajax({
		url : "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=" + get.id,
		dataType : "jsonp"
	}).done(function(data) {

		$("#name").append(data.product.name.toUpperCase());
		for (var i = 0; i < 3 && i < data.product.imageUrl.length; i++) {
			var views = $('<div class="myView thumbnail col-md-12"> <img class="img-responsive" src=' + data.product.imageUrl[i] + '></img> </div>');
			$('.views').append(views);
		}
		var img = $('<div class="thumbnail col-md-12"><img src=' + data.product.imageUrl[0] + ' class="img-responsive 1" alt="Responsive image"></img></div>');
		$(".view").append(img);

		var talleunico = 0;
		// TOCO MISHU PARA ARREGLAR CUANDO NO HAY TALLE

		/** ver en el notepad la estructura del jason, agregar uno por cada talle*/
		for (var i = 0; i < data.product.attributes.length; i++) {
			//carga las opciones
			if (loadOptions(data, i) == 1) {// TOCO MISHU PARA ARREGLAR CUANDO NO HAY TALLE
				talleunico++;
			}
			//Descripción
			loadDescription(data, i);
		}

		if (talleunico == 0) {// TOCO MISHU PARA ARREGLAR CUANDO NO HAY TALLE
			$('#talle').append('<option>' + 'Único' + '</option>');
		}

		var price = parseFloat(data.product.price).toFixed(2);
		$('#price').replaceWith('<p id="price"> $' + price + '</p>');
		var quant = $("#quantity").val();
		price = parseFloat((parseInt(quant) * price)).toFixed(2);
		$('#subtotal').replaceWith('<p id="subtotal"> $' + price + '</p>');

	}).done(function() {

		$('.myView').click(function() {
			var aux = $(this).clone();
			$('.view').empty();
			$('.view').append(aux);

		});

		//set opacity to 0.4 for all the images
		//opacity = 1 - completely opaque
		//opacity = 0 - invisible

		$('.myView img').css('opacity', 0.4);

		// when hover over the selected image change the opacity to 1
		$('.myView').hover(function() {
			$(this).find('img').stop().fadeTo('slow', 1);
		}, function() {
			$(this).find('img').stop().fadeTo('slow', 0.4);
		});

	});

	/** Cuando cambia la cantidad, modifica el valor**/
	$("#quantity").change(function() {
		var quant = $("#quantity").val();
		var price = $("#price").text();
		price = price.toString(price);
		price = price.substring(2, price.length);
		var subt = parseFloat((parseInt(quant) * price)).toFixed(2);
		$('#subtotal').replaceWith('<p id="subtotal"> $' + subt + '</p>');

	});

});

$('#addtocart').on("click", function() {
	if (localStorage.getItem("loged") == 'false') {
		$("#alerta2").addClass('in');
		setTimeout(function() {
			$("#alerta2").removeClass('in');
		}, 3000);
	} else {

		var salir = 'no';

		$.ajax({// PIDO EL CARRITO
			url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken") + "&id=" + localStorage.getItem("cartID"),
			timeout : 10000,
			dataType : "jsonp"
		}).done(function(data) {
			if ( typeof data.error != "undefined") {
				$("#alerta4").addClass('in');
				setTimeout(function() {
					$("#alerta4").removeClass('in');
				}, 3000);
			} else {
				for (var j = 0; j < data.order.items.length && salir == 'no'; j++) {// BUSCA A VER SI YA ESTA EL PRODUCTO EN EL CARRITO
					if (parseInt(get.id) == data.order.items[j].product.id) {
						salir = 'si';
					}
				}
				if (salir == 'si') {// YA ESTA EL PRODUCTO EN CARRITO
					j--;
					var cant = data.order.items[j].quantity + parseInt($('#quantity').val());

					var prod = {
						"order" : {
							"id" : parseInt(localStorage.getItem("cartID"))
						},
						"product" : {
							"id" : parseInt(get.id)
						},
						"quantity" : cant
					};

					$.ajax({// LO AGREGA DE NUEVO CON LA SUMA DE LA CANTIDAD ACTUAL + LA DEL QUE YA ESTABA
						url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken") + "&order_item=" + JSON.stringify(prod),
						timeout : 10000,
						dataType : "jsonp"
					}).done(function(data2) {

						if ( typeof data2.error != "undefined") {
							$("#alerta4").addClass('in');
							setTimeout(function() {
								$("#alerta4").removeClass('in');
							}, 3000);
						} else {
							$("#alerta3").addClass('in');
							setTimeout(function() {
								$("#alerta3").removeClass('in');
							}, 3000);

							$.ajax({// BORRA EL VIEJO
								url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken") + '&id=' + data.order.items[j].id,
								timeout : 10000,
								dataType : "jsonp"
							}).done(function(data3) {
								refrescarBadgeCarrito();
							});

						}

					});
				} else {// NO ESTABA EL PRODUCTO EN CARRITO

					var prod = {
						"order" : {
							"id" : parseInt(localStorage.getItem("cartID"))
						},
						"product" : {
							"id" : parseInt(get.id)
						},
						"quantity" : parseInt($('#quantity').val())
					};

					$.ajax({// LO AGREGA CON LA CANTIDAD INDICADA
						url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken") + "&order_item=" + JSON.stringify(prod),
						timeout : 10000,
						dataType : "jsonp"
					}).done(function(data2) {

						if ( typeof data2.error != "undefined") {
							$("#alerta4").addClass('in');
							setTimeout(function() {
								$("#alerta4").removeClass('in');
							}, 3000);
						} else {
							$("#alerta3").addClass('in');
							setTimeout(function() {
								$("#alerta3").removeClass('in');
							}, 3000);
							refrescarBadgeCarrito();
						}
					});
				}
			}
		});

	}
});

function refrescarBadgeCarrito() {
	$('#cantprod').empty();
	if (localStorage.getItem("loged") == 'true') {
		$.ajax({
			url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + localStorage.getItem('username') + "&authentication_token=" + localStorage.getItem('authenticationToken') + "&id=" + localStorage.getItem('cartID'),
			timeout : 10000,
			dataType : "jsonp",
		}).done(function(data) {
			if ( typeof data.error == "undefined") {
				var cant = 0;
				for (var i = 0; i < data.order.items.length; i++) {
					cant += data.order.items[i].quantity;
				};
				$('#cantprod').append(cant);
			}else{
				alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
			}
		});
	} else {
		$('#cantprod').append('0');
	}
}