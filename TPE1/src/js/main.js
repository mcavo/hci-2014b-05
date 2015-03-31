$('ul.nav li.dropdown').hover(function() {
	$(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(500);
}, function() {
	$(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(500);
});

if (localStorage.getItem("loged") == 'true') {
	var butlog = $("<div id='butlog' class='btn-group'>" + "<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>" + localStorage.getItem('firstName') + " " + "<span class='caret'>" + "</span>" + "</button>" + "<ul class='dropdown-menu' role='menu'>" + "<li>" + "<a href='cuenta.html'>" + "Mi Cuenta" + "</a>" + "</li>" + "<li class='divider'>" + "</li>" + "<li>" + "<a id='signout' href='#'>" + "Cerrar Sesión" + "</a>" + "</li>" + "</ul>" + "</div>");
	$("#ingresar").replaceWith(butlog);
	$("#signout").on("click", function() {
		localStorage.setItem("loged", "false");
		var ingresar = $("<button id='ingresar'class='btn btn-primary' data-toggle='modal' data-target='#myModal'>" + "INGRESAR" + "</button>");
		$("#butlog").replaceWith(ingresar);
		$.ajax({
			url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignOut&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken"),
			timeout : 10000,
			dataType : "jsonp",
		}).done(function(data2) {
			if ( typeof data2.error != "undefined")
				alert(data2.error.message);
			else{
				window.location.href="./index.html";
			}
		});
	});

}else {
	localStorage.setItem("loged","false");
}

$.ajax({// INICIO MENU DINAMICO
	url : "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllCategories",
	timeout : 10000,
	dataType : "jsonp",
}).done(function(data) {
	if ( typeof data.error == "undefined"){
		var item;
		for (var i = 0; i < data.categories.length; i++) {
			var niños = 0;
			for (var j = 0; j < data.categories[i].attributes[0].values.length; j++) {
				//pongo los titulos de las categorias en cada seccion (hombre, mujer o niño)
				if (data.categories[i].attributes[0].values[j] == "Adulto") {
					for (var k = 0; k < data.categories[i].attributes[1].values.length; k++) {
						if (data.categories[i].attributes[1].values[k] == "Femenino") {
							item = $('<li class="col-sm-4">' + '<ul id="' + 'femenino' + data.categories[i].name + '">' + '<li class="dropdown-header">' + '<a href="catalogo.html?catId=' + data.categories[i].id + '&catName=' + data.categories[i].name + '&gen=fem&edad=adulto">' + data.categories[i].name + '</a>' + '</li>' + '</ul>' + '</li>');
							$('#botonmujer').append(item);
						} else if (data.categories[i].attributes[1].values[k] == "Masculino") {
							item = $('<li class="col-sm-4">' + '<ul id="' + 'masculino' + data.categories[i].name + '">' + '<li class="dropdown-header">' + '<a href="catalogo.html?catId=' + data.categories[i].id + '&catName=' + data.categories[i].name + '&gen=masc&edad=adulto">' + data.categories[i].name + '</a>' + '</li>' + '</ul>' + '</li>');
							$('#botonhombre').append(item);
						}
					}
				} else if ((data.categories[i].attributes[0].values[j] == "Bebe" || data.categories[i].attributes[0].values[j] == "Infantil") && niños != -1) {
					niños = -1;
					item = $('<li class="col-sm-12">' + '<ul id="' + 'niño' + data.categories[i].name + '">' + '<li class="dropdown-header">' + '<a href="catalogo.html?catId=' + data.categories[i].id + '&catName=' + data.categories[i].name + '&edad=ninio">' + data.categories[i].name + '</a>' + '</li>' + '</ul>' + '</li>');
					$('#botonniño').append(item);

				}
			}
			//apendear todas las subcategorias
			$.ajax({
				url : "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllSubcategories&id=" + data.categories[i].id,
				timeout : 10000,
				dataType : "jsonp",
			}).done(function(pepe) {
				if ( typeof pepe.error == "undefined"){
					for (var l = 0; l < pepe.subcategories.length; l++) {
						niños = 0;
						for (var m = 0; m < pepe.subcategories[l].attributes[0].values.length; m++) {
							if (pepe.subcategories[l].attributes[0].values[m] == "Adulto") {
								for (var n = 0; n < pepe.subcategories[l].attributes[1].values.length; n++) {
									if (pepe.subcategories[l].attributes[1].values[n] == "Femenino") {
										item = $('<li>' + '<a href="catalogo.html?subId=' + pepe.subcategories[l].id + '&catName=' + pepe.subcategories[l].category.name + '&subName=' + pepe.subcategories[l].name + '&gen=fem&edad=adulto">' + pepe.subcategories[l].name + '</a>' + '</li>');
										$('#femenino' + pepe.subcategories[l].category.name).append(item);
									} else if (pepe.subcategories[l].attributes[1].values[n] == "Masculino") {
										item = $('<li>' + '<a href="catalogo.html?subId=' + pepe.subcategories[l].id + '&catName=' + pepe.subcategories[l].category.name + '&subName=' + pepe.subcategories[l].name + '&gen=masc&edad=adulto">' + pepe.subcategories[l].name + '</a>' + '</li>');
										$('#masculino' + pepe.subcategories[l].category.name).append(item);
									}
								}
							} else if ((pepe.subcategories[l].attributes[0].values[m] == "Bebe" || pepe.subcategories[l].attributes[0].values[m] == "Infantil") && niños != -1) {
								niños = -1;
								item = $('<li>' + '<a href="catalogo.html?subId=' + pepe.subcategories[l].id +'&catName=' + pepe.subcategories[l].category.name + '&subName=' + pepe.subcategories[l].name + '&edad=ninio">' + pepe.subcategories[l].name + '</a>' + '</li>');
								$('#niño' + pepe.subcategories[l].category.name).append(item);

							}
						}
					}
				}else{
					alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
				}
			});
		}
	}else{
		alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
	}
});
// FIN MENU DINAMICO

refrescarBadgeCarrito();

$('#ingresar3').on("click", function() {

	if(verifUsername($('#inputUsuario3').val())==-1 || verifPassword($('#inputContraseña3').val(),$('#inputContraseña3').val())==-1){
		$('#errores1').empty();
		$('#errores1').append('<li class="list-group-item list-group-item-danger"><strong>Error al ingresar</strong></li>');
		if(verifUsername($('#inputUsuario3').val())==-1){
			$('#errores1').append('<li class="list-group-item list-group-item-danger">El <strong>Usuario</strong> es invalido</li>');
		}
		if(verifPassword($('#inputContraseña3').val(),$('#inputContraseña3').val())==-1){
			$('#errores1').append('<li class="list-group-item list-group-item-danger">La <strong>Contraseña</strong> es incorrecta</li>');
		}
		return -1;
	}

	$.ajax({
		url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + $('#inputUsuario3').val() + "&password=" + $('#inputContraseña3').val(),
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data) {
		var error = data.error;
		if ( typeof error != "undefined"){
			var mensaje;
			$('#errores1').empty();
			$('#errores1').append('<li class="list-group-item list-group-item-danger"><strong>Error al ingresar</strong></li>');
			switch(error.code) {
			    case 101:
			        mensaje ='El <strong>Usuario</strong> es invalido';
			        break;
			    case 104:
			        mensaje ='El <strong>Nombre de usuario</strong> es invalido';
			        break;			        
			    case 105:
			        mensaje='La <strong>Contraseña</strong> es incorrecta';
			        break;
			    default:
			        mensaje='Lo sentimos pero no ha podido ingresar debido a un error, por favor intente de nuevo en unos minutos';
			}
			$('#errores1').append('<li class="list-group-item list-group-item-danger">'+mensaje+'</li>');
		}
		else {
			var butlog = $("<div id='butlog' class='btn-group'>" + "<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>" + data.account.firstName + " " + "<span class='caret'>" + "</span>" + "</button>" + "<ul class='dropdown-menu' role='menu'>" + "<li>" + "<a href='cuenta.html'>" + "Mi Cuenta" + "</a>" + "</li>" + "<li class='divider'>" + "</li>" + "<li>" + "<a id='signout' href='#'>" + "Cerrar Sesión" + "</a>" + "</li>" + "</ul>" + "</div>");
			$("#ingresar").replaceWith(butlog);
			localStorage.setItem("username", data.account.username);
			localStorage.setItem("authenticationToken", data.authenticationToken);
			localStorage.setItem("loged", "true");
			localStorage.setItem("firstName", data.account.firstName);
			cargarIDCarrito();
			$('#myModal').modal('hide');
			$("#alerta").addClass('in');
			setTimeout(function() {
				$("#alerta").removeClass('in');
			}, 3000);

			$("#signout").on("click", function() {
				localStorage.setItem("loged", "false");
				var ingresar = $("<button id='ingresar'class='btn btn-primary' data-toggle='modal' data-target='#myModal'>" + "INGRESAR" + "</button>");
				$("#butlog").replaceWith(ingresar);
				$.ajax({
					url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignOut&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken"),
					timeout : 10000,
					dataType : "jsonp",
				}).done(function(data2) {
					if ( typeof data2.error != "undefined")
						alert(data2.error.message);
					else{
						window.location.href="./index.html";
					}
				});
			});
		}
	});
});

$('#registrarse').on("click", function() {
	var gender;
	if ($("#radio1").is(":checked")) {
		gender = "M";
	} else {
		gender = "F";
	}
	var datosRegistro = {
		"username" : $('#inputUsuario').val(),
		"password" : $('#inputContraseña').val(),
		"firstName" : $('#inputNombre').val(),
		"lastName" : $('#inputApellido').val(),
		"gender" : gender,
		"identityCard" : $('#inputDNI').val(),
		"email" : $('#inputEmail').val(),
		"birthDate" : $('#inputBirth').val(),
	};

	if (verifUsername(datosRegistro.username) == -1 || verifPassword(datosRegistro.password, $('#inputContraseña2').val()) == -1 || verifNames(datosRegistro.firstName, datosRegistro.lastName) == -1 || verifDNI(datosRegistro.identityCard) == -1 || verifEmail(datosRegistro.email, $('#inputEmail2').val()) == -1 || verifBirth(datosRegistro.birthDate) == -1) {
		$('#errores2').empty();
		$('#errores2').append('<li class="list-group-item list-group-item-danger"><strong>Error al registrarse</strong></li>');
		if(verifUsername(datosRegistro.username)==-1)
			$('#errores2').append('<li class="list-group-item list-group-item-danger"><strong>Nombre de usuario:</strong> campo obligatorio,debe tener una longitud de entre 6 y 15 caracteres alfanuméricos</li>');
		if(verifPassword(datosRegistro.password, $('#inputContraseña2').val())==-1)
			$('#errores2').append('<li class="list-group-item list-group-item-danger"><strong>Password:</strong> campo obligatorio, debe tener una longitud de entre 8 y 15 caracteres y debe coincidir con su repeticion</li>');
		if(verifNames(datosRegistro.firstName, datosRegistro.lastName)==-1)
			$('#errores2').append('<li class="list-group-item list-group-item-danger"><strong>Nombre y apellido:</strong>campos obligatorio, como maximo pueden tenes 80 caracteres</li>');
		if(verifDNI(datosRegistro.identityCard)==-1)
			$('#errores2').append('<li class="list-group-item list-group-item-danger"><strong>D.N.I:</strong>campo obligatorio, debe tener el siguiente formato: xx.xxx.xxx donde x es un digito</li>');
		if(verifEmail(datosRegistro.email, $('#inputEmail2').val())==-1)
			$('#errores2').append('<li class="list-group-item list-group-item-danger"><strong>Email:</strong>campo obligatorio, debe ser un mail valido de como maximo 128 caracteres, debe coincidir con su repeticion</li>');
		if(verifBirth(datosRegistro.birthDate)==-1)
			$('#errores2').append('<li class="list-group-item list-group-item-danger"><strong>Fecha de nacimiento:</strong> debe tener el formato AAAA-MM-DD</li>');

		return -1;
		//avisar al usuario
	}

	$.ajax({
		url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAccount&account=" + JSON.stringify(datosRegistro),
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data1) {
		var error = data1.error;
		if ( typeof error != "undefined"){
			var mensaje;
			$('#errores2').empty();
			$('#errores2').append('<li class="list-group-item list-group-item-danger"><strong>Error al registrarse</strong></li>');
			switch(error.code) {
			    case 200:
			        mensaje ='El <strong>Nombre de usuario</strong> ya esta en uso, por favor elija otro';
			        break;
			    case 201:
			        mensaje='El <strong>D.N.I</strong> ya esta en uso';
			        break;
			    default:
			        mensaje='Lo sentimos pero no ha podido registrarse debido a un error, por favor intente de nuevo en unos minutos';
			}
			$('#errores2').append('<li class="list-group-item list-group-item-danger">'+mensaje+'</li>');

		}	
		else {
			$.ajax({
				url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + datosRegistro.username + "&password=" + datosRegistro.password,
				timeout : 10000,
				dataType : "jsonp",
			}).done(function(data2) {
				var error = data2.error;
				if ( typeof error != "undefined")
					alert(error.message);
				else {
					var butlog = $("<div id='butlog' class='btn-group'>" + "<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>" + data2.account.firstName + " " + "<span class='caret'>" + "</span>" + "</button>" + "<ul class='dropdown-menu' role='menu'>" + "<li>" + "<a href='cuenta.html'>" + "Mi Cuenta" + "</a>" + "</li>" + "<li class='divider'>" + "</li>" + "<li>" + "<a id='signout' href='#'>" + "Cerrar Sesión" + "</a>" + "</li>" + "</ul>" + "</div>");
					$("#ingresar").replaceWith(butlog);
					localStorage.setItem("username", data2.account.username);
					localStorage.setItem("authenticationToken", data2.authenticationToken);
					localStorage.setItem("loged", "true");
					localStorage.setItem("firstName", data2.account.firstName);
					cargarIDCarrito();
					$("#signout").on("click", function() {
						localStorage.setItem("loged", "false");
						var ingresar = $("<button id='ingresar'class='btn btn-primary' data-toggle='modal' data-target='#myModal'>" + "INGRESAR" + "</button>");
						$("#butlog").replaceWith(ingresar);
						$.ajax({
							url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignOut&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken"),
							timeout : 10000,
							dataType : "jsonp",
						}).done(function(data2) {
							if ( typeof data2.error != "undefined")
								alert(data2.error.message);
							else{
								window.location.href="./index.html";
							}
						});
					});
				}
			});

			$('#myModal').modal('hide');
			$("#alerta").addClass('in');
			setTimeout(function() {
				$("#alerta").removeClass('in');
			}, 3000);

		};

	});

	$("#signout").on("click", function() {
		localStorage.setItem("loged", "false");
		var ingresar = $("<button id='ingresar'class='btn btn-primary' data-toggle='modal' data-target='#myModal'>" + "INGRESAR" + "</button>");
		$("#butlog").replaceWith(ingresar);
		$.ajax({
			url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignOut&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken"),
			timeout : 10000,
			dataType : "jsonp",
		}).done(function(data2) {
			if ( typeof data2.error != "undefined")
				alert(data2.error.message);
			else{
				window.location.href="./index.html";
			}
		});
	});
});

$('#carrito').on("click", function() {
	if(localStorage.getItem("loged")=='true'){
		window.location.href="./carrito.html";
	}else{
		$("#alerta5").addClass('in');
		setTimeout(function() {
			$("#alerta5").removeClass('in');
		}, 3000);
	}
});

function verifUsername(username) {// negativo: prublema - positivo: ok
	isAlphaNum = /[A-Za-z0-9]/;
	var len = username.length;
	if (len < 6 || len > 15)
		return -1;
	for (var i = 0; i < len; i++) {
		if (!isAlphaNum.test(username[i])) {
			return -1;
		}
	}
	return 1;
}

function verifPassword(p1, p2) {
	var p1len = p1.length;
	if (p1 != p2)
		return -1;
	if (p1len < 8 || p1len > 15)
		return -1;
	return 1;
}

function verifNames(first, last) {
	if (first.length > 0 && last.length > 0 && first.length < 81 && last.length < 81)
		return 1;
	return -1;
}

function verifDNI(dni) {
	isDNI = /[0-9][0-9].[0-9][0-9][0-9].[0-9][0-9][0-9]$/;
	if (!isDNI.test(dni)) {
		return -1;
	}
	return 1;
}

function verifBirth(birth) {
	isBirth = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/;
	if (!isBirth.test(birth))
		return -1;
	return 1;
}

function verifEmail(e1, e2) {
	isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
	if (e1 != e2)
		return -1;
	if (!isEmail.test(e1))
		return -1;
	return 1;
}

function cargarIDCarrito(){
	
	var cartID;
	var salir='no';

	$.ajax({
		url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken"),
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data1) {
		if ( typeof data1.error == "undefined"){
			for (var i = 0; i<data1.orders.length && salir=='no' ; i++) {
				if (data1.orders[i].status == 1) {
					cartID = data1.orders[i].id;
					salir = 'si';
					localStorage.setItem("cartID",cartID);
					refrescarBadgeCarrito();
				}
			}

			if(salir == 'no'){		//NO HABIA CARRITO CREADO, LO CREAMOS
				$.ajax({
					url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username=" + localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken"),
					dataType : "jsonp",
				}).done(function(data2) {
					cartID = data2.order.id;
					localStorage.setItem("cartID",cartID);
					refrescarBadgeCarrito();
				});
			}
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});
}

function refrescarBadgeCarrito(){
	$('#cantprod').empty();
	if (localStorage.getItem("loged")=='true') {
		$.ajax({
			url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username="+localStorage.getItem('username')+"&authentication_token="+localStorage.getItem('authenticationToken')+"&id="+localStorage.getItem('cartID'),
			timeout : 10000,
			dataType : "jsonp",
		}).done(function(data) {
			if ( typeof data.error == "undefined"){
				var cant = 0;
				for (var i = 0; i<data.order.items.length; i++) {
					cant+=data.order.items[i].quantity;
				};
				$('#cantprod').append(cant);
			}else{
				alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
			}
		});
	}else{
		$('#cantprod').append('0');
	}
}