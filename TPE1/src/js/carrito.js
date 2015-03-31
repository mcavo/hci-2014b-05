

var cantProd;

$('#button-buy').on('click', function (){
	if(cantProd!=0){
		window.location.href='./pagar.html';
	}else{
		$("#alerta1").addClass('in');
		setTimeout(function() {
			$("#alerta1").removeClass('in');
		}, 3000);
	}
});

$('.button-empty').on('click', function (){
	$.ajax({	// PETICION PARA CARGAR PRODUCTOS AL CARRITO
		url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username="+localStorage.getItem('username')+"&authentication_token="+localStorage.getItem('authenticationToken')+"&id="+localStorage.getItem('cartID'),
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data) {
		if ( typeof data.error == "undefined"){
			for (var i = 0; i < data.order.items.length ; i++){ 
				deleteProduct(i, data);
			}
		} else {// SI ACTUALIZO ACA LA PAGINA NO SE LLEGAN A HACER LAS PETICIONES PARA BORRAR LOS PRODUCTOS
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
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
	}).done(function(data) {
		if ( typeof data.error == "undefined"){
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
					timeout : 10000,
					dataType : "jsonp",
				}).done(function(data2) {
					if ( typeof data2.error == "undefined"){
						cartID = data2.order.id;
						localStorage.setItem("cartID",cartID);
						refrescarBadgeCarrito();
					}else{
						alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
					}
				});
			}
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});
}

$.ajax({	// PETICION PARA CARGAR PRODUCTOS AL CARRITO
	url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username="+localStorage.getItem('username')+"&authentication_token="+localStorage.getItem('authenticationToken')+"&id="+localStorage.getItem('cartID'),
	timeout : 10000,
	dataType : "jsonp",
}).done(function(data) {
	if ( typeof data.error == "undefined"){
		var cant=0;
		var tot=0;
		for (var i = 0; i < data.order.items.length ; i++){ 
			loadProduct(i,data);
			cant+=data.order.items[i].quantity;
			tot+=data.order.items[i].quantity*data.order.items[i].price;
		};
		$('#total').append('<h4>'+'<strong>'+'TOTAL: $'+tot.toFixed(2)+'</strong>'+'</h4>');
		$('#cantidad').append('<h4>'+'<strong>'+'CANTIDAD: '+cant+'</strong>'+'</h4>');
		cantProd=cant;
	} else{
		alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
	}
});


function loadProduct(i,data){
	$.ajax({// PETICION DE PRODUCTO PARA MARCA Y COLOR
		url : "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id="+data.order.items[i].product.id,
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data2) {
		if ( typeof data2.error == "undefined"){
			var salir=0;
			var marca;
			var color;
			for (var j = 0; j < data2.product.attributes.length && salir!=2; j++) {
				if(data2.product.attributes[j].name == "Color"){
					color=data2.product.attributes[j].values[0];
					salir++;
				}
				if(data2.product.attributes[j].name == "Marca"){
					marca=data2.product.attributes[j].values[0];
					salir++;
				}
			}
			var articulo = '<div class="col-md-12 product-description">'+
										'<div class="col-md-2">'+
											'<img class="product-image" src="'+data.order.items[i].product.imageUrl+'"/>'+
										'</div>'+
										'<div clas="col-md-10">'+
											'<div class="col-md-10 nombre-producto">'+
												'<div class="pull-left">'+
													'<h4>'+'<strong>'+data.order.items[i].product.name+'  -</strong>  '+marca+'</h4>'+
												'</div>'+
												'<div class="pull-right">'+
													'<button type="button" id="delete'+data.order.items[i].id+'" class="btn btn-danger product-delete">'+
														'<i class="borrar glyphicon glyphicon-trash">'+'</i>'+
													'</button>'+
												'</div>'+
											'</div>'+
											'<div class="col-md-10">'+
												'<ul class="list-inline">'+
													'<li>'+'CANTIDAD: '+'<span>'+data.order.items[i].quantity+'</span>'+'</li>'+
														'<li>'+'COLOR: '+'<span>'+color+'</span>'+'</li>'+
												'</ul>'+
												'<ul class="list-inline">'+
													'<li>'+'PRECIO: $'+'<span>'+data.order.items[i].price.toFixed(2)+'</span>'+'</li>'+
												'</ul>'+
												'<ul class="list-inline">'+
													'<li>SUBTOTAL: $'+'<span>'+(data.order.items[i].quantity*data.order.items[i].price).toFixed(2)+'</span>'+'</li>'+
												'</ul>'+
											'</div>'+
										'</div>'+
									'</div>';
			$('#contenedor').append(articulo);

			$('#delete'+data.order.items[i].id).on('click', function (){
				$.ajax({// BORRAR ITEM DEL CARRITO
					url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username="+localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken")+"&id="+data.order.items[i].id,
					timeout : 10000,
					dataType : "jsonp",
				}).done(function(data2) {
					location.reload();
				});
			});
		}else{
			alert('Lo sentimos pero no se ha podido completar la acción debido a un error, por favor intente nuevamente o contáctenos.');
		}
	});
}

function deleteProduct(i, data){
	$.ajax({// BORRAR ITEM DEL CARRITO
		url : "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username="+localStorage.getItem("username") + "&authentication_token=" + localStorage.getItem("authenticationToken")+"&id="+data.order.items[i].id,
		timeout : 10000,
		dataType : "jsonp",
	}).done(function(data2) {
		if (typeof data2.error != "undefined") {
			console.log(data2.error.message);
		}else{
			if(i==data.order.items.length-1){
				location.reload();
			}
		}
	});
}