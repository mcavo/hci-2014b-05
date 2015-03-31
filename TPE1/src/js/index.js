var novedades = [224, 419, 420, 180, 223, 177, 181, 175, 8, 176, 215, 61, 19, 33, 22, 233, 9, 60, 30, 260, 261, 262, 1, 37, 34, 217, 42, 13, 174, 46, 54, 26, 220, 201, 202];
var ofertas = [230, 44, 219, 190, 62, 57, 405, 43, 246, 249, 221, 55, 51, 52, 6, 231, 232, 20, 12, 235, 58, 179, 1, 263, 286, 266, 264, 267, 265, 234, 7, 29, 27, 14, 31, 15, 38, 50, 47];

function loadProduct(data, i) {
	var oldPrice = (parseFloat(data.products[i].price * 120) / 100).toFixed(2);
	for (var j = 0; j < novedades.length; j++) {
		if (data.products[i].id == novedades[j]) {
			for (var k = 0; k < ofertas.length; k++) {
				if (data.products[i].id == ofertas[k]) {
					
					//NUEVO Y EN OFERTA
					var div = $('<div class="col-md-3">' + '<a href="producto.html?id=' + data.products[i].id + '" class="thumbnail">' + '<span class="label label-primary nuevo">Nuevo</span>' + '<span class="label label-default oferta">Oferta</span>' + '<img src=' + data.products[i].imageUrl[0] + ' alt=""/>' + '<div class="caption product-description">' + '<h5>' + data.products[i].attributes[0].values[0] + '</h5><h4>' + data.products[i].name + '</h4>' + '<p class="oferta"> ' + '<del> $' + oldPrice + '</del> $' + parseFloat(data.products[i].price).toFixed(2) + '</p></div></a></div>');
					return div;
				}
			}
			//SOLO NUEVO
			var div = $('<div class="col-md-3">' + '<a href="producto.html?id=' + data.products[i].id + '" class="thumbnail">' + '<span class="label label-primary nuevo">Nuevo</span>' + '<img src=' + data.products[i].imageUrl[0] + ' alt=""/>' + '<div class="caption product-description">' + '<h5>' + data.products[i].attributes[0].values[0] + '</h5><h4>' + data.products[i].name + '</h4>' + '<p> $ ' + parseFloat(data.products[i].price).toFixed(2) + '</p></div></a></div>');
			return div;

		}
	}
	for (var k = 0; k < ofertas.length; k++) {
		if (data.products[i].id == ofertas[k]) {
			//SOLO EN OFERTA
			var div = $('<div class="col-md-3">' + '<a href="producto.html?id=' + data.products[i].id + '" class="thumbnail">' + '<span class="label label-default oferta">Oferta</span>' + '<img src=' + data.products[i].imageUrl[0] + ' alt=""/>' + '<div class="caption product-description">' + '<h5>' + data.products[i].attributes[0].values[0] + '</h5><h4>' + data.products[i].name + '</h4>' + '<p class="oferta"> ' + '<del> $' + oldPrice + '</del> $' + parseFloat(data.products[i].price).toFixed(2) + '</p></div></a></div>');
			return div;
		}
	}
	//COMUN
	var div = $('<div class="col-md-3">' + '<a href="producto.html?id=' + data.products[i].id + '" class="thumbnail">' + '<img src=' + data.products[i].imageUrl[0] + ' alt=""/>' + '<div class="caption product-description">' + '<h5>' + data.products[i].attributes[0].values[0] + '</h5><h4>' + data.products[i].name + '</h4>' + '<p> $ ' + parseFloat(data.products[i].price).toFixed(2) + '</p></div></a></div>');
	return div;
}

function loadProductIndex(attr) {
	var filter = (attr == 'Nuevo') ? [{
		"id" : 6,
		"value" : "Nuevo"
	}] : [{
		"id" : 5,
		"value" : "Oferta"
	}];
	filter = encodeURIComponent(JSON.stringify(filter));
	$.ajax({
		url : "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&page_size=4&filters=" + filter,
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data) {
		if(typeof data.error == "undefined"){
			for (var i = 0; i < data.products.length; i++) {
				var div = loadProduct(data,i);
				$("#" + attr.toLowerCase()).append(div);
			}
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});
}


$(document).ready(function() {
	loadProductIndex('Nuevo');
	loadProductIndex('Oferta');

});

