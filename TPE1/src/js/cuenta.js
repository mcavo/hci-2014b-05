if(localStorage.getItem("loged")!= "true"){
 window.location.href="./index.html";
}

$(document).ready(function() {

	var username = localStorage.getItem('username');
	var authenticationToken = localStorage.getItem('authenticationToken');

	$.ajax({		// AGREGANDO DATOS DE LA CUENTA
		url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username="+username+"&authentication_token="+authenticationToken,
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data) {
		if ( typeof data.error == "undefined"){
			$('#firstname').append(data.account.firstName);
			$('#lastname').append(data.account.lastName);
			$('#birth').append(data.account.birthDate);		
			$('#username').append(data.account.username);
			$('#email').append(data.account.email);
			$('#fechadecreacion').append((data.account.createdDate).substring(0,10));
			$('#ultimoinicio').append((data.account.lastLoginDate).substring(0,10));
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});

	$.ajax({		// AGREGANDO PEDIDOS
		url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username="+username+"&authentication_token="+authenticationToken,
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data) {
		if ( typeof data.error == "undefined"){
			var estado;
			var fechaEstado;
			for (var i = 0; i < data.orders.length; i++) {
				if (data.orders[i].status != 1) {
					if(data.orders[i].status==2){
						estado = 'Confirmado';
						fechaEstado = data.orders[i].processedDate;
					}
					else if(data.orders[i].status==3){
						estado = 'Despachado';
						fechaEstado = data.orders[i].shippedDate;
					}
					else if(data.orders[i].status==4){
						estado = 'Entregado';
						fechaEstado = data.orders[i].deliverededDate;
						if (typeof fechaEstado == 'undefined') {
							fechaEstado = data.orders[i].shippedDate;
						}
					}
					cargarPedido(i,data,estado,fechaEstado);					
				}
			}
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});
	
	function cargarPedido(i,data,estado,fechaEstado){
		$.ajax({		//CARGO TOTAL
			url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username="+localStorage.getItem("username")+"&authentication_token="+localStorage.getItem("authenticationToken")+"&id="+data.orders[i].id,
			timeout : 10000,
			dataType : "jsonp",
		}).done(function(data2) {
			if ( typeof data2.error == "undefined"){
				var total = 0;
				for(var j = 0; j < data2.order.items.length; j++){
					total += data2.order.items[j].price * data2.order.items[j].quantity;
				}
				var item = $('<div class="myContainer">'+'<dl class="dl-horizontal">'+'<dt>'+'Número:'+'</dt>'+'<dd>'+data.orders[i].id+'</dd>'+'</dl>'+
										'<dl class="dl-horizontal">'+'<dt>'+'Estado:'+'</dt>'+'<dd>'+estado+'</dd>'+'</dl>'+
										'<dl class="dl-horizontal">'+'<dt>'+'Dirección de envío:'+'</dt>'+'<dd>'+data.orders[i].address.name+'</dd>'+'</dl>'+
										'<dl class="dl-horizontal">'+'<dt>'+'Fecha de creación:'+'</dt>'+'<dd>'+(data.orders[i].receivedDate).substring(0,10)+'</dd>'+'</dl>'+
										'<dl class="dl-horizontal">'+'<dt>'+'Fecha de entrega:'+'</dt>'+'<dd>'+fechaEstado.substring(0,10)+'</dd>'+'</dl>'+
										'<dl class="dl-horizontal">'+'<dt>'+'Precio total: '+'</dt>'+'<dd>$'+total+'</dd>'+'</dl>'+'/div');
				$('#listapedidos').append(item);
			}else{
				alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
			}
		});
	}

	$.ajax({		// AGREGANDO DIRECCIONES
		url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username="+username+"&authentication_token="+authenticationToken,
		dataType : "jsonp",
	}).done(function(data) {

		$.ajax({		// MAPA PROVINCIAS
			url : "http://eiffel.itba.edu.ar/hci/service3/Common.groovy?method=GetAllStates",
			dataType : "jsonp",
		}).done(function(map) {

			for (var i = 0; i < data.addresses.length; i++) {

				var floor = data.addresses[i].floor;
				var gate = data.addresses[i].gate;
				var ciudad = data.addresses[i].city;
				var provincia = data.addresses[i].province;
				var salir = 'no';
				for (var p = 0; p < map.states.length && salir=='no'; p++) {
					if (provincia == map.states[p].stateId) {
						provincia = map.states[p].name;
						salir == 'si';
					}
				}
				if (!floor) {
					floor = '-';
				}
				if (!gate) {
					gate = '-';
				}
				if(!ciudad){
					ciudad = '-';
				}

				var item = $('<div class="myContainer">'+
									'<div class="pull-right">'+
										'<button type="button" id="deleteld'+data.addresses[i].id+'" class="btn btn-danger product-delete">'+
											'<i class="borrar glyphicon glyphicon-trash">'+'</i>'+
										'</button>'+
									'</div>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Nombre:'+'</dt>'+'<dd>'+data.addresses[i].name+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Calle:'+'</dt>'+'<dd>'+data.addresses[i].street+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Puerta:'+'</dt>'+'<dd>'+data.addresses[i].number+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Piso:'+'</dt>'+'<dd>'+floor+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Departamento:'+'</dt>'+'<dd>'+gate+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Provincia:'+'</dt>'+'<dd>'+provincia+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Ciudad:'+'</dt>'+'<dd>'+ciudad+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Código postal:'+'</dt>'+'<dd>'+data.addresses[i].zipCode+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Teléfono:'+'</dt>'+'<dd>'+data.addresses[i].phoneNumber+'</dd>'+'</dl>'+
							'/div');
				$('#listadirecciones').append(item);
				comportamientoBorrarLD(data,i);


			}
			
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
			
		});
	});

	$.ajax({		// AGREGANDO MEDIOS DE PAGO
		url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllCreditCards&username="+username+"&authentication_token="+authenticationToken,
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data) {
		if(typeof data.error == "undefined"){
			for (var i = 0; i < data.creditCards.length; i++) {		
				var medio = data.creditCards[i].number;
				if (medio[0] == '4') {
					medio = 'Visa';
				}
				else if (medio[0] == '5') {
					medio = 'Mastercard';
				}
				else if (medio[0] == '3') {
					if (medio[1]=='6') {
						medio = 'Diners';
					}
				}
				if (medio[0] == '3' && (medio[1]=='4' || medio[1]=='7')) {
					medio = 'American Express';
				}
				var item = $('<div class="myContainer">'+
									'<div class="pull-right">'+
										'<button type="button" id="deletemp'+data.creditCards[i].id+'" class="btn btn-danger product-delete">'+
											'<i class="borrar glyphicon glyphicon-trash">'+'</i>'+
										'</button>'+
									'</div>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Medio de pago:'+'</dt>'+'<dd>'+medio+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Número:'+'</dt>'+'<dd>'+data.creditCards[i].number+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Fecha de vencimiento:'+'</dt>'+'<dd>'+'20'+(data.creditCards[i].expirationDate).substring(2,4)+'-'+(data.creditCards[i].expirationDate).substring(0,2)+'</dd>'+'</dl>'+
									'<dl class="dl-horizontal">'+'<dt>'+'Código de seguridad:'+'</dt>'+'<dd>'+data.creditCards[i].securityCode+'</dd>'+'</dl>'+
							'/div');
				$('#listamediosdepago').append(item);
				comportamientoBorrarMP(data,i);

			}	
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}	
	});

});	


function comportamientoBorrarMP(data,i){
	$('#deletemp'+data.creditCards[i].id).on('click', function (){
		$.ajax({// BORRAR METODO DE PAGO
			url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteCreditCard&username="+localStorage.getItem("username")+"&authentication_token="+localStorage.getItem("authenticationToken")+"&id="+data.creditCards[i].id,
			timeout : 10000,
			dataType : "jsonp",
		}).done(function(data2) {
			if(typeof data2.error == "undefined"){
				location.reload();
			}else{
				alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
			}
		});
	});
}

function comportamientoBorrarLD(data,i){
	$('#deleteld'+data.addresses[i].id).on('click', function (){
		$.ajax({// BORRAR DIRECCION
			url : "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteAddress&username="+localStorage.getItem("username")+"&authentication_token="+localStorage.getItem("authenticationToken")+"&id="+data.addresses[i].id,
			timeout : 10000,
			dataType : "jsonp",
		}).done(function(data2) {
			if(typeof data2.error == "undefined"){
				location.reload();
			}else{
				alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
			}
		});
	});
}

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
		dataType : "jsonp",
	}).done(function(map) {

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
