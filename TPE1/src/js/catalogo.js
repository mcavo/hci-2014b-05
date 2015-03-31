var urlPag = "";
var pageNum = 1;
var filColor = 0;
var filMarca = 0;
var filOcasion = 0;
var goURL = "catalogo.html?";
var novedades = [224, 419, 420, 180, 223, 177, 181, 175, 8, 176, 215, 61, 19, 33, 22, 233, 9, 60, 30, 260, 261, 262, 1, 37, 34, 217, 42, 13, 174, 46, 54, 26, 220, 201, 202];
var ofertas = [230, 44, 219, 190, 62, 57, 405, 43, 246, 249, 221, 55, 51, 52, 6, 231, 232, 20, 12, 235, 58, 179, 1, 263, 286, 266, 264, 267, 265, 234, 7, 29, 27, 14, 31, 15, 38, 50, 47];

//<span class="label label-default">Default Label</span>
//<span class="label label-primary">Primary Label</span>

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

function compareProducts(idComp, data1, i, data2, j) {
	//Ascendente
	if (idComp == 2 || idComp == 8) {
		return valueToCompare(idComp, data1, i).toLowerCase() < valueToCompare(idComp, data2, j).toLowerCase();
	}
	if (idComp == 4) {
		return valueToCompare(idComp, data1, i) < valueToCompare(idComp, data2, j);
	}
	//Descendente
	if (idComp == 12)
		return valueToCompare(idComp, data1, i) > valueToCompare(idComp, data2, j);
	return valueToCompare(idComp, data1, i).toLowerCase() > valueToCompare(idComp, data2, j).toLowerCase();
}

function valueToCompare(idComp, data, i) {
	//Nombre
	if (idComp == 2 || idComp == 6) {
		return data.products[i].name;
	}
	//Precio
	if (idComp == 4 || idComp == 12)
		return data.products[i].price;
	//Marca
	return data.products[i].attributes[0].values[0];
}

// LEVANTARLO
// filters = localStorage.getItem("filters");
// SETEAR
// localStorage.setItem("filters", filters);

function getGET() {
	var get = {};
	var loc = document.location.href;
	var getString = loc.split('?')[1];
	if (getString != undefined) {
		var GET = getString.split('&');
		//this object will be filled with the key-value pairs and returned.

		for (var i = 0, l = GET.length; i < l; i++) {
			var tmp = GET[i].split('=');
			get[tmp[0]] = unescape(decodeURI(tmp[1]));
		}
	}
	return get;
}

function getCatId(name) {
	if (name === "Calzado")
		return 1;
	if (name === "Indumentaria")
		return 2;
	if (name === "Accesorios")
		return 3;
}

function getFilters(get) {
	var filters = '[';
	if (get.edad != undefined) {
		filters += getFilterbyValue(get.edad);
	}
	if (get.gen != undefined) {
		filters += getFilterbyValue(get.gen);
	}
	if (get.esp != undefined) {
		filters += getFilterbyValue(get.esp);
	}
	filters += ']';
	return filters;
}

function getFilterbyValue(value) {
	if (value === "oferta") {
		return '{"id":5,"value":"Oferta"},';
	}
	if (value === "nuevo") {
		return '{"id":6,"value":"Nuevo"},';
	}
	if (value === "masc") {
		return '{"id":1,"value":"Masculino"},';
	}
	if (value === "fem") {
		return '{"id":1,"value":"Femenino"},';
	}
	if (value === "adulto") {
		return '{"id":2,"value":"Adulto"},';
	}
	if (value === "Infantil") {
		return '{"id":2,"value":"Infantil"},';
	}
	if (value === "Bebe") {
		return '{"id":2,"value":"Bebe"},';
	}
	return "";
}

function sortbyValue(num) {
	var sort = "";
	if (num == 0)
		return sort;
	if (num % 8 == 0) {
		sort += "sort_key=marca";
	} else if (num % 4 == 0) {
		sort += "sort_key=precio";
	} else if (num % 2) {
		sort += "sort_key=nombre";
	}
	//El ascendente es por defecto asi que no pasa nada si no lo pasamos
	//A pesar de que solo tiene que ser divisible por 3 le pedimos que sea por 2 para que tenga un sort-key
	if (num % 6 == 0)
		sort += "&sort_order=desc";
	return sort;
}

/**
 function loadCategory(catId) {
 $.ajax({
 url : "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllSubcategories&id=" + catId,
 dataType : "jsonp"
 }).done(function(data) {
 var option = $('<option value=" ' + data.subcategories[0].category.name + '">' + data.subcategories[0].category.name + '</option>');
 $("#categoria").append(option);
 for (var i = 0; i < data.subcategories.length; i++) {
 var option = $('<option value=" ' + data.subcategories[i].name + '">' + data.subcategories[i].name + '</option>');
 $("#categoria").append(option);
 }
 var valores = [];
 $("#categoria option").each(function(j, value) {
 if (j > 0) {
 valores[j - 1] = $(value).text();
 }
 });
 $("#txtcategoria").autocomplete({
 source : valores.sort(),
 minLength : 0,
 select : function(event, ui) {
 var opcion = $("#categoriaoption").filter(function(index) {
 return $(this).text() == ui.item.label;
 }).val();
 }
 });
 $("#btncategoria").click(function() {
 $("#txtcategoria").focus();
 $("#txtcategoria").autocomplete("search", "");

 });
 $("#txtcategoria").click(function() {
 $("#txtcategoria").select();
 $("#txtcategoria").autocomplete("search", "");
 $("#txtcategoria").focus();
 });
 });
 };

 function loadCategories() {
 loadCategory(1);
 loadCategory(2);
 loadCategory(3);
 }
 **/
function loadAttr(attrId) {
	$.ajax({
		url : "http://eiffel.itba.edu.ar/hci/service3/Common.groovy?method=GetAttributeById&id=" + attrId,
		timeout : 10000,
		dataType : "jsonp"
	}).done(function(data) {
		if ( typeof data.error == "undefined"){
			for (var i = 0; i < data.attribute.values.length; i++) {
				var option = $("<option value='" + data.attribute.values[i] + "'>" + data.attribute.values[i] + '</option>');
				$("#" + data.attribute.name.toLowerCase()).append(option);
			}
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});
}

function loadFiltros() {
	loadAttr(4);
	loadAttr(9);
	loadAttr(3);
};

function filtrar(num1, num2, num3) {

	$('#filtroBread').remove();
	var datos = "";
	var breadCrumb = "";
	if (num1 != 0) {
		datos += '{"id":4,"value":' + '"' + num1 + '"' + '},';
		breadCrumb += "Color<i> " + num1 + "</i>";
	}
	if (num2 != 0) {
		datos += '{"id":9,"value":' + '"' + num2 + '"' + '},';
		if (breadCrumb != "")
			breadCrumb += ", ";
		breadCrumb += "Marca<i> " + num2  +"</i>";
	}
	if (num3 != 0) {
		datos += '{"id":3,"value":' + '"' + num3 + '"' + '},';
		if (breadCrumb != "")
			breadCrumb += ", ";
		breadCrumb += "Ocasión<i> " + num3 + "</i>";
	}
	if (breadCrumb != "") {
		breadCrumb = "Filtros: " + breadCrumb;
		var bread = $('<li id="filtroBread">' + breadCrumb + '</li>');
		$(".breadcrumb").append(bread);
	}
	return datos;
}

function setPagination(data) {
	var pages = Math.ceil(parseFloat(data.total) / 12);
	if (pages >= 2) {
		var aux = parseInt(pageNum) - 1;
		if (pageNum == 1) {
			$('.pagination').append("<li title='Primera' class='disabled aux'><a href='#'><span class='glyphicon glyphicon-fast-backward'></span></a></li>");
		} else {
			$('.pagination').append("<li title='Primera' class='aux'><a href='" + goURL + "&page=1'><span class='glyphicon glyphicon-fast-backward'></span></a></li>");
		}
		if (pageNum <= 2) {
			$('.pagination').append("<li title='Anterior' class='disabled aux'><a href='#'><span class='glyphicon glyphicon-step-backward'></span></a></li>");
		} else {
			$('.pagination').append("<li title='Anterior' class='aux'><a href='" + goURL + "&page=" + aux + "'><span class='glyphicon glyphicon-step-backward'></span></a></li>");
		}
		if (pageNum <= 1)
			aux = 1;
		if (pageNum == pages && pageNum > 2)
			aux = pageNum - 2;
		for (var i = aux; i < aux + 3 && i <= pages; i++) {
			if (i == pageNum) {
				$('.pagination').append("<li class='active'><a href='#'>" + i + "</a></li>");
			} else {
				$('.pagination').append("<li><a href='" + goURL + "&page=" + i + "'>" + i + "</a></li>");
			}
		}
		aux = parseInt(pageNum) + 1;
		if (pageNum == pages) {
			$('.pagination').append("<li title='Siguiente' class='disabled next'><a href='#'><span class='glyphicon glyphicon-step-forward'></span></a></li>");
			$('.pagination').append("<li title='Última' class='disabled aux'><a href='#'><span class='glyphicon glyphicon-fast-forward'></span></a></li>");
		} else {
			$('.pagination').append("<li title='Siguiente' class='next'><a href='" + goURL + "&page=" + aux + "'><span class='glyphicon glyphicon-step-forward'></span></a></li>");
			$('.pagination').append("<li title='Última' class='aux'><a href='" + goURL + "&page=" + pages + "'><span class='glyphicon glyphicon-fast-forward'></span></a></li>");
		}
	}
	return;
};

$(document).ready(function() {
	loadFiltros();
	var get = getGET();
	if (get.page != undefined)
		pageNum = get.page;
	var bread;

	if (get.search != undefined) {
		goURL += "search=" + get.search;
		url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByName&name=" + get.search + "&page_size=12";
		bread = $('<li class="active"><a href="catalogo.html?search=' + get.search + '"> Búsqueda: "' + get.search + '"</a></li>');
		$(".breadcrumb").append(bread);
	} else if (get.subId != undefined) {
		goURL += "subId=" + get.subId + "&subName=" + get.subName + "&catName=" + get.catName;
		url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsBySubcategoryId&id=" + get.subId + "&page_size=12";
	} else if (get.catId != undefined) {
		goURL += "catId=" + get.catId + "&catName=" + get.catName;
		url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=" + get.catId + "&page_size=12";
	} else {
		url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&page_size=12";
	}
	var breadUrl = "";
	if (get.edad != "ninio") {
		if (get.edad != undefined) {
			if (goURL != "catalogo.html?")
				goURL += "&";
			goURL += "edad=" + get.edad;
		}
		if (get.gen != undefined) {
			var genero = (get.gen === "fem") ? "Mujer" : "Hombre";
			if (goURL != "catalogo.html?")
				goURL += "&";
			goURL += "gen=" + get.gen;
			breadUrl = "catalogo.html?gen=" + get.gen;
			bread = $('<li class="active"><a href="' + genero.toLowerCase() + '.html">' + genero + '</a></li>');
			$(".breadcrumb").append(bread);
		}
		if (get.catName != undefined) {
			if (breadUrl != "")
				breadUrl += "&";
			else
				breadUrl = "catalogo.html?";
			breadUrl += "catName=" + get.catName;
			bread = $('<li class="active"><a href="' + breadUrl + '&catId=' + getCatId(get.catName) + '">' + get.catName + '</a></li>');
			$(".breadcrumb").append(bread);
		}
		if (get.subName != undefined) {
			if (breadUrl != "")
				breadUrl += "&";
			else
				breadUrl = "catalogo.html?";
			breadUrl += "subName=" + get.subName;
			bread = $('<li class="active"><a href="' + breadUrl + '&subId=' + get.subId + '">' + get.subName + '</a></li>');
			$(".breadcrumb").append(bread);
		}
		if (get.esp != undefined) {
			if (breadUrl != "")
				breadUrl += "&";
			else
				breadUrl = "catalogo.html?";
			breadUrl += "esp=" + get.esp;
			if (goURL != "catalogo.html?")
				goURL += "&";
			goURL += "esp=" + get.esp;
			var name = (get.esp == "nuevo") ? "Novedades" : "Ofertas";
			bread = $('<li class="active"><a href="' + breadUrl + '">' + name + '</a></li>');
			$(".breadcrumb").append(bread);
		}
		var filt = getFilters(get);
		if (filt != "[]") {
			url += "&filters=" + filt;
		}

		// f[0]!=0 || f[1]!=0 && || f[2]!=0 -> load filters
		if (get.ch != undefined) {
			filColor = localStorage.getItem("filColor");
			filMarca = localStorage.getItem("filMarca");
			filOcasion = localStorage.getItem("filOcasion");
			if (get.search != undefined || filt == "[]")
				url += "&filters=[]";
			url = url.substring(0, url.length - 1);
			//levanto f(0),f(1) y f(2)
			url += filtrar(filColor, filMarca, filOcasion);
			url += ']';
			if (goURL != "catalogo.html?")
				goURL += "&";
			goURL += "ch=" + get.ch;
		}

		if (get.sort != undefined) {
			url += "&" + sortbyValue(get.sort);
			var aux = (get.sort % 3 == 0 ) ? 3 : 1;
			if (get.sort != 0) {
				$('#sort-key').val(parseInt(get.sort / aux));
				$('#sort-order').val(aux);
				$('#sort-order').removeClass('hide');
				$('#sortBtn').removeClass('hide');
			}
		}
		$.ajax({
			url : url + "&page=" + pageNum,
			dataType : "jsonp"
		}).done(function(data) {
			setPagination(data);

			for (var i = 0; i < data.products.length; i++) {
				var div = loadProduct(data, i);
				$("#productos").append(div);
			}
			//No hay productos
			if (i === 0) {
				$('.sort').empty();
				var div = $('<div class="alert alert-warning col-md-12" role="alert"><p> Lo sentimos pero no tenemos ningún producto de dichas características.</p></div>');
				$("#productos").append(div);
			}

			$('#filtrar').on("click", function() {
				filColor = $('#color').val();
				filMarca = $('#marca').val();
				filOcasion = $('#ocasion').val();
				localStorage.setItem("filColor", filColor);
				localStorage.setItem("filMarca", filMarca);
				localStorage.setItem("filOcasion", filOcasion);

				if (goURL != "catalogo.html?")
					goURL += "&";
				goURL += "ch=" + 1;

				if (get.sort != undefined) {

					goURL += "&sort=" + get.sort;
				}
				window.location.href = goURL;
				return false;
			});

			$('#sort-key').change(function() {
				if ($('#sort-key').val() != 0) {
					$('#sort-order').removeClass('hide');
					$('#sortBtn').removeClass('hide');
				} else {
					if (get.ch != undefined) {
						if (goURL != "catalogo.html?")
							goURL += "&";
						goURL += "ch=" + 1;
					}
					window.location.href = goURL;
					return false;
				}
				return;
			});

			$('#sortBtn').on("click", function() {
				var acum = parseInt($('#sort-key').val());
				if (get.ch != undefined) {
					if (goURL != "catalogo.html?")
						goURL += "&";
					goURL += "ch=" + 1;
				}
				if (acum != 0) {
					acum *= parseInt($('#sort-order').val());
					if (goURL != "catalogo.html?")
						goURL += "&";
					goURL += "sort=" + acum;
				}
				window.location.href = goURL;
				return false;
			});

		});

	} else {
		//Llego con ninio, apartir de aca no necesito preguntar para agregar el &
		if (goURL != "catalogo.html?")
			goURL += "&";
		goURL += "edad=ninio";
		breadUrl = "catalogo.html?edad=ninio";
		bread = $('<li class="active"><a href="ninio.html"> Niño </a></li>');
		$(".breadcrumb").append(bread);
		if (get.catName != undefined) {
			breadUrl += "&catName=" + get.catName;
			bread = $('<li class="active"><a href="' + breadUrl + '&catId=' + getCatId(get.catName) + '">' + get.catName + '</a></li>');
			$(".breadcrumb").append(bread);
		}
		if (get.subName != undefined) {
			breadUrl += "&subName=" + get.subName;
			bread = $('<li class="active"><a href="' + breadUrl + '&subId=' + get.subId + '">' + get.subName + '</a></li>');
			$(".breadcrumb").append(bread);
		}
		if (get.sort != undefined) {
			url += "&" + sortbyValue(get.sort);
			var aux = (get.sort % 3 == 0 ) ? 3 : 1;
			if (get.sort != 0) {
				$('#sort-key').val(parseInt(get.sort / aux));
				$('#sort-order').val(aux);
				$('#sort-order').removeClass('hide');
				$('#sortBtn').removeClass('hide');
			}
		}
		var filt = getFilters(get);
		url += "&filters=" + filt;
		if (get.ch != undefined) {
			filColor = localStorage.getItem("filColor");
			filMarca = localStorage.getItem("filMarca");
			filOcasion = localStorage.getItem("filOcasion");
			url = url.substring(0, url.length - 1);
			//levanto f(0),f(1) y f(2)
			url += filtrar(filColor, filMarca, filOcasion);
			url += ']';
			if (goURL != "catalogo.html?")
				goURL += "&";
			goURL += "ch=" + get.ch;
		}
		var urlI = url.substring(0, url.length - 1) + getFilterbyValue('Infantil') + ']';
		var urlB = url.substring(0, url.length - 1) + getFilterbyValue('Bebe') + ']';
		$.ajax({
			url : urlI,
			dataType : "jsonp"
		}).done(function(dataI) {
			$.ajax({
				url : urlB,
				timeout : 10000,
				dataType : "jsonp"
			}).done(function(dataB) {
				if ( typeof error == "undefined"){
					if (get.sort === undefined) {
						for (var i = 0; i < dataI.products.length; i++) {
							var div = loadProduct(dataI, i);
							$("#productos").append(div);
						}

						if (dataI.products.length + dataB.products.length === 0) {
							$('.sort').empty();
							var div = $('<div class="alert alert-warning col-md-12" role="alert"><p> Lo sentimos pero no tenemos ningún producto de dichas características.</p></div>');
							$("#productos").append(div);
						}

						for (var i = 0; i < dataB.products.length; i++) {
							var div = loadProduct(dataB, i);
							$("#productos").append(div);
						}
					} else {
						//Tengo que SORTEAR A MANO
						//var childs = $element.children();
						//for (var i = 1; i < childs.length - 1; i++)
						//	childs[i].foo();
						$('#productos').hide();
						for (var i = 0; i < dataI.products.length; i++) {
							var div = loadProduct(dataI, i);
							$("#productos").append(div);
						}
						var products = $('#productos').children();
						//voy a iterar los productos ya agregados
						var i = 0;
						for (var j = 0; i < dataB.products.length && j < products.length; j++) {

							if (compareProducts(get.sort, dataB, i, dataI, j)) {
								var div = loadProduct(dataB, i);
								$(products[j]).before(div);
								i++;
								j--;
								//Asi no avanzo de mas
							}

						}
						if (i < dataB.products.length) {
							for (; i < dataB.products.length; i++) {
								var div = loadProduct(dataB, i);
								$("#productos").append(div);
							}
						}
						$('#productos').show();

					}
				}else{
					alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
				}
			});

		});

		$('#sort-key').change(function() {
			if ($('#sort-key').val() != 0) {
				$('#sort-order').removeClass('hide');
				$('#sortBtn').removeClass('hide');

			} else {
				if (get.ch != undefined) {
					if (goURL != "catalogo.html?")
						goURL += "&";
					goURL += "ch=" + 1;
				}
				window.location.href = goURL;
				return false;
			}

		});

		$('#sortBtn').on("click", function() {
			var acum = parseInt($('#sort-key').val());
			if (get.ch != undefined) {
				if (goURL != "catalogo.html?")
					goURL += "&";
				goURL += "ch=" + 1;
			}
			if (acum != 0) {
				acum *= parseInt($('#sort-order').val());
				if (goURL != "catalogo.html?")
					goURL += "&";
				goURL += "sort=" + acum;
			}

			window.location.href = goURL;
			return false;

		});

		$('#filtrar').on("click", function() {
			filColor = $('#color').val();
			filMarca = $('#marca').val();
			filOcasion = $('#ocasion').val();
			localStorage.setItem("filColor", filColor);
			localStorage.setItem("filMarca", filMarca);
			localStorage.setItem("filOcasion", filOcasion);

			if (goURL != "catalogo.html?")
				goURL += "&";
			goURL += "ch=" + 1;

			if (get.sort != undefined) {

				goURL += "&sort=" + get.sort;
			}
			window.location.href = goURL;
			return false;
		});

	}

});
