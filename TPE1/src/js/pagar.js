if(localStorage.getItem("loged")!= "true"){
 window.location.href="./index.html";
}

$.ajax({		// AGREGANDO DIRECCIONES YA EXISTENTES
	url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username="+localStorage.getItem('username')+"&authentication_token="+localStorage.getItem('authenticationToken'),
	timeout : 10000,
	dataType : "jsonp",
}).done(function(data) {
	if ( typeof data.error == "undefined"){
		for (var i = 0; i < data.addresses.length ; i++) {
			$('#myDir').append('<option value="'+data.addresses[i].id+'">'+data.addresses[i].name+'</option>');
		}
	}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
	}
});	

$.ajax({		// AGREGANDO MEDIOS DE PAGO YA EXISTENTES
	url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllCreditCards&username="+localStorage.getItem('username')+"&authentication_token="+localStorage.getItem('authenticationToken'),
	timeout : 10000,
	dataType : "jsonp",
}).done(function(data) {
	if ( typeof data.error == "undefined"){
		for (var i = 0; i < data.creditCards.length; i++) {		
			var medio = data.creditCards[i].number;
			if (medio[0] == '4') {
				medio = 'VISA: '+data.creditCards[i].number;
			}
			else if (medio[0] == '5') {
				medio = 'MASTER: '+data.creditCards[i].number;
			}
			else if (medio[0] == '3') {
				if (medio[1]=='6') {
					medio = 'DINERS: '+data.creditCards[i].number;
				}
			}
			if (medio[0] == '3' && (medio[1]=='4' || medio[1]=='7')) {
				medio = 'AMEX: '+data.creditCards[i].number;
			}

			$('#myCred').append('<option value="'+data.creditCards[i].id+'">'+medio+'</option>');
		}
	}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
	}
});

$('#agregardireccion').on("click", function() {

	var salir = 'no';
	$('#erroresdireccion').empty();

	if(verif($('#inputNombre').val(),1,80,null)==-1 || verif($('#inputCalle').val(),1,80,null)==-1 || verif($('#inputPuerta').val(),1,6,/[A-Za-z0-9]*/)==-1 ||
		verif($('#inputPiso').val(),0,3,/[A-Za-z0-9]*/)==-1 || verif($('#inputDepartamento').val(),0,2,/[A-Za-z0-9]*/)==-1 ||
		verif($('#inputCP').val(),1,10,/[A-Za-z0-9]*/)==-1 || verif($('#inputTelefono').val(),1,25,null)==-1){

			salir = 'si';		
			if(verif($('#inputNombre').val(),1,80,null)==-1){
				$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Nombre inválido: </strong>debe constar de entre 1 y 80 caracteres alfanuméricos y especiales.</li>');
			}
			if(verif($('#inputCalle').val(),1,80,null)==-1){
				$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Calle inválida: </strong>debe constar de entre 1 y 80 caracteres alfanuméricos y especiales.</li>');
			}
			if(verif($('#inputPuerta').val(),1,6,/[A-Za-z0-9]*/)==-1){
				$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Puerta inválida: </strong>debe constar de entre 1 y 6 caracteres alfanuméricos.</li>');
			}
			if(verif($('#inputPiso').val(),0,3,/[A-Za-z0-9]*/)==-1){
				$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Piso inválido: </strong>debe constar de entre 1 y 3 caracteres alfanuméricos (puede ser vacío).</li>');
			}
			if(verif($('#inputDepartamento').val(),0,2,/[A-Za-z0-9]*/)==-1){
				$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Departamento inválido: </strong>debe constar de entre 1 y 2 caracteres alfanuméricos (puede ser vacío).</li>');
			}
			if(verif($('#inputCP').val(),1,10,/[A-Za-z0-9]*/)==-1){
				$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Código postal inválido: </strong>debe constar de entre 1 y 10 caracteres alfanuméricos.</li>');
			}
			if(verif($('#inputTelefono').val(),1,25,null)==-1){
				$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Teléfono inválido: </strong>debe constar de entre 1 y 25 caracteres alfanuméricos y especiales.</li>');
			}
	}
	if($('#provv').val() != "Ciudad Autonoma de Buenos Aires"){
		if(verif($('#inputCiudad').val(),1,80,/[A-Za-z]*/)==-1){
			$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Ciudad inválida: </strong>debe constar de entre 1 y 80 caracteres alfabéticos.</li>');
			salir = 'si';
		}
	}

	if(salir=='si'){
		return -1;
	}

	$.ajax({		// MAPA PROVINCIAS
		url : "http://eiffel.itba.edu.ar/hci/service3/Common.groovy?method=GetAllStates",
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(map) {
		if ( typeof map.error == "undefined"){
			var aux;
			var gate;
			var floor;

			var salirp = 'no';
			for (var p = 0; p < map.states.length && salirp=='no'; p++) {
				if ($('#provv').val() == map.states[p].name) {
					aux = map.states[p].stateId;
					salirp == 'si';
				}
			}

			gate=$('#inputDepartamento').val().length== 0 ? "-":$('#inputDepartamento').val();
			floor=$('#inputPiso').val().length== 0 ? "-": $('#inputPiso').val();

			var newdir = {
			"name" : $('#inputNombre').val(),
			"street" : $('#inputCalle').val(),
			"number" : $('#inputPuerta').val(),
			"floor" : floor,
			"gate" : gate,
			"province" : aux,
			"city" : $('#inputCiudad').val(),
			"zipCode" : $('#inputCP').val(),
			"phoneNumber" : $('#inputTelefono').val()
			};

			$.ajax({
				url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+localStorage.getItem("username")+"&authentication_token="+localStorage.getItem("authenticationToken")+"&address="+JSON.stringify(newdir),
				timeout : 10000,
				dataType : "jsonp",
			}).done(function(data) {
				if ( typeof data.error != "undefined"){
					var mensaje;
					$('#erroresdireccion').empty();
					$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger"><strong>Error al registrarse</strong></li>');
					switch(data.error.code) {
					    case 202:
					        mensaje ='El <strong>Nombre</strong> ya esta en uso, por favor elija otro';
					        break;
					    default:
					        mensaje='Lo sentimos pero no se ha podido agregar la direccion debido a un error, por favor intente de nuevo en unos minutos';
					}
					$('#erroresdireccion').append('<li class="list-group-item list-group-item-danger">'+mensaje+'</li>');
				}else {
					location.reload();
				}
			});
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});
});

function verif(string, minlen, maxlen, exp){
	if(string.length>=minlen && string.length<=maxlen){
		if (exp) {						// SI exp ES QUE PERMITE ALFANUM Y ESPECIALES, Y CON QUE VALIDE LA LONGITUD ALCANZA
			if (exp.test(string))
				return 1;
			else
				return -1;
		}
		return 1;
	}
	return -1;
}

$('#agregarmediodepago').on("click", function() {

	var salir = 'no';
	var salir2 = 'no';

	var numero = $('#inputNumero').val();
	numeroexp = /[0-9]*/;
	var expiration = $('#inputVencimiento').val();
	expirationexp = /^\d{2}(0[1-9]|1[012])$/;
	var security = $('#inputSeguridad').val();

	$('#errorespago').empty();

	if(numero.length==0 || expiration.length==0 || security.length==0){
		$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Los 3 campos son obligatorios!</strong></li>');
		salir = 'si';
	}


	if(numeroexp.test(numero)){
		if (!(numero[0]=='4' && (numero.length==13 || numero.length==16))) {	// SI NO ES VISA
			if (!(numero[0]=='5' && numero.length==16 && (numero[1]=='1' || numero[1]=='2' || numero[1]=='3'))) {	//SI NO ES MASTECARD
				if (!(numero[0]=='3' && numero[1]=='6' && numero.length==16)) {		//SI NO ES DINERS
					if (!(numero[0]=='3' && numero.length==15 && (numero[1]=='4' || numero[1]=='7'))) {		//SI NO ES AMERICAN
						$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Tarjeta inválida!</strong></li>');
						$('#errorespago').append('<li class="list-group-item list-group-item-danger">American Express: comienza con 34 o 37 y tiene una longitud de 15 posiciones.</li>');
						$('#errorespago').append('<li class="list-group-item list-group-item-danger">Diners: comienzan con 36 y tienen una longitud de 16 posiciones.</li>');
						$('#errorespago').append('<li class="list-group-item list-group-item-danger">Mastercard: comienzan con 51, 52 o 53 y tienen una longitud de 16 posiciones.</li>');
						$('#errorespago').append('<li class="list-group-item list-group-item-danger">Visa: comienzan con 4 y tienen una longitud de 13 o 16 posiciones.</li>');
						salir = 'si';
					}
				}
			}
		}
	} else{
		$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Tarjeta inválida!</strong></li>');
		$('#errorespago').append('<li class="list-group-item list-group-item-danger">American Express: comienza con 34 o 37 y tiene una longitud de 15 posiciones.</li>');
		$('#errorespago').append('<li class="list-group-item list-group-item-danger">Diners: comienzan con 36 y tienen una longitud de 16 posiciones.</li>');
		$('#errorespago').append('<li class="list-group-item list-group-item-danger">Mastercard: comienzan con 51, 52 o 53 y tienen una longitud de 16 posiciones.</li>');
		$('#errorespago').append('<li class="list-group-item list-group-item-danger">Visa: comienzan con 4 y tienen una longitud de 13 o 16 posiciones.</li>');
		salir = 'si';
	}

	if(expiration.substring(0,2)=="20" && expiration.length==7 && expiration[4]=="-" && ((parseInt(expiration.substring(0,4))==2014 && parseInt(expiration.substring(5,7))>=10) || parseInt(expiration.substring(0,4))>2014)){
		expiration=expiration.substring(2,4)+expiration.substring(5,7);
	} else {
		$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Vencimiento inválido! </strong></li>');
		$('#errorespago').append('<li class="list-group-item list-group-item-danger">Debe ser de la forma AAAA-MM</li>');
		salir = 'si';
		salir2 = 'si';	
	}

	if(!expirationexp.test(expiration) && salir2 != "si"){
		$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Vencimiento inválido! </strong></li>');
		$('#errorespago').append('<li class="list-group-item list-group-item-danger">Debe ser de la forma AAAA-MM</li>');
		salir = 'si';
	}

	if (numeroexp.test(security)) {
		if (numero[0]=='3' && (numero[1]=='4' || numero[1]=='7')) {	// SI ES AMERICAN Y EL CODE NO TIENE LONG 4
			if (security.length != 4) {
				$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Código de seguridad inválido!</strong></li>');
				$('#errorespago').append('<li class="list-group-item list-group-item-danger">American Express: tiene una longitud de 4 posiciones.</li>');
				$('#errorespago').append('<li class="list-group-item list-group-item-danger">Otras: tiene una longitud de 3 posiciones.</li>');
				salir = 'si';
			}
		}
		else if(security.length != 3){							// EL CODE DEL RESTO TIENE LONG 3
			$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Código de seguridad inválido!</strong></li>');
				$('#errorespago').append('<li class="list-group-item list-group-item-danger">American Express: tiene una longitud de 4 posiciones.</li>');
				$('#errorespago').append('<li class="list-group-item list-group-item-danger">Otras: tiene una longitud de 3 posiciones.</li>');
				salir = 'si';
		}
	} else{
		$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Código de seguridad inválido!</strong></li>');
				$('#errorespago').append('<li class="list-group-item list-group-item-danger">American Express: tiene una longitud de 4 posiciones.</li>');
				$('#errorespago').append('<li class="list-group-item list-group-item-danger">Otras: tiene una longitud de 3 posiciones.</li>');
				salir = 'si';
	}

	if(salir == 'si'){
		return -1;
	}

	var newmet = {
	"number" : numero,
	"expirationDate" : expiration,
	"securityCode" : security
	};

	$.ajax({
		url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateCreditCard&username="+localStorage.getItem("username")+"&authentication_token="+localStorage.getItem("authenticationToken")+"&credit_card="+JSON.stringify(newmet),
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data) {
		if ( typeof data.error != "undefined"){
			var mensaje;
			$('#errorespago').empty();
			$('#errorespago').append('<li class="list-group-item list-group-item-danger"><strong>Error al registrarse</strong></li>');
			switch(data.error.code) {
			    case 136:
			        mensaje ='La <strong>Fecha de vencimiento</strong> es inválida';
			        break;
			    case 137:
			        mensaje ='El <strong>Código de seguridad</strong> es inválido';
			        break;
			    case 203:
			        mensaje ='El <strong>Número</strong> ya está en uso';
			        break;
			    default:
			        mensaje='Lo sentimos pero no se ha podido agregar la tarjeta debido a un error, por favor intente de nuevo en unos minutos';
			}
			$('#errorespago').append('<li class="list-group-item list-group-item-danger">'+mensaje+'</li>');
		}else {
			location.reload();
		}
	});
});

$.ajax({		// MAPA PROVINCIAS
	url : "http://eiffel.itba.edu.ar/hci/service3/Common.groovy?method=GetAllStates",
	timeout : 10000,
	dataType : "jsonp",
}).done(function(map) {
	if ( typeof map.error == "undefined"){
		for (var p = 0; p < map.states.length; p++){								// APROVECHO Y CARGO LAS PROVINCIAS DEL MODAL AQUI
			if (map.states[p].stateId=='C') {
				$('#provv').append('<option value="'+map.states[p].name+'">'+map.states[p].name+'</option>');
			}
			else{
				$('#provv').append('<option value="'+map.states[p].name+'">'+map.states[p].name+'</option>');
			}
		}
		$('#provv').on("click", function() {
			var isCABA = $('#provv').val();
			if(isCABA=="Ciudad Autonoma de Buenos Aires"){
				$('#ciudad').addClass('hide');
			}
			else{
				$('#ciudad').removeClass('hide');
			}
		});
	}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
	}
});

$('#comprar').on("click", function() {

	var addressid = parseInt($('#myDir').val());
	var paymentid = parseInt($('#myCred').val());
	var order;
	if(paymentid==0){
		order={
			"id": parseInt(localStorage.getItem('cartID')),
			"address": {
			"id": addressid
			}
			};
	} else {
		order={
			"id": parseInt(localStorage.getItem('cartID')),
			"address": {
			"id": addressid
			},
			"creditCard": {
			"id": paymentid
			}
			};
	}
	$.ajax({		// MAPA PROVINCIAS
		url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=ConfirmOrder&username="+localStorage.getItem('username')+"&authentication_token="+localStorage.getItem('authenticationToken')+"&order="+JSON.stringify(order),
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data) {
		if(typeof data.error != "undefined"){
			$("#alerta").addClass('in');
			setTimeout(function() {
				$("#alerta").removeClass('in');
			}, 3000);
		}else{
			cargarIDCarrito();

		}
	});

});

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
					window.location.href="./comprarealizada.html";	
				});
			}
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});
}



























