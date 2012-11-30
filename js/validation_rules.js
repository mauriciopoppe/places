//jQuery.validator.setDefaults({
//	debug: true,
//	success: "valid"
//});

$(document).ready(function(){
	
	rules = {
			nombre: {
				required: true,
				maxlength: 50
			},
			apellido_paterno: {
				required: true,
				maxlength: 40
			},
			apellido_materno: {
				required: true,
				maxlength: 40
			},
			direccion: {
				required: true,
				maxlength: 180
			},
			telefono: {
				required: true,
				digits: true,
				minlength: 7,
				maxlength: 10
			},
			inicio: {
				required: true,
				time: true,
				validTime: true
			},
			fin: {
				required: true,
				time: true,
				validTime: true
			},
			status: {
				statusCheck: true,
				required: true
			},
			detalles: {
				maxlength: 200
			},
			usuario: {
				required: true,
				minlength: 5,
				maxlength: 20
			},
			pass: {
				required: true,
				minlength: 5,
				maxlength: 40
			},
			verify: {
				required: true,
				equalTo: "#pass"
			},
			email: {
				required: true,
				email: true,
				maxlength: 50
			},
			//blue direction for the form inside the banner
			blue_address: {
				required: true
			}
		};

	messages = {
		nombre: {
			required: "Nombre requerido",
			maxlength: "Longitud maxima excedida"
		},
		apellido_paterno: {
			required: "Apellido paterno requerido",
			maxlength: "Longitud maxima excedida"
		},
		apellido_materno: {
			required: "Apellido materno requerido",
			maxlength: "Longitud maxima excedida"
		},
		direccion: {
			required: "Direccion requerida",
			maxlength: "Longitud maxima excedida"
		},
		telefono: {
			required: 'Telefono requerido',
			digits: 'El telefono solo puede contener digitos',
			minlength: $.format('El telefono debe tener al menos {0} digitos'),			
			maxlength: "Longitud maxima excedida"
		},
		inicio: {
			required: "Inicio de atencion requerido",
			time: "El formato debe ser hh:mm"
		},
		fin: {
			required: "Fin de atencion requerido",
			time: "El formato debe ser hh:mm"
		},
		status: {
			required: "Status requerido (0 o 1)"
		},
		detalles: {
			maxlength: "Longitud maxima excedida"
		},
		usuario: {
			required: 'Nombre de usuario requerido',
			minlength: $.format('El nombre de usuario debe tener al menos {0} caracteres'),		
			maxlength: "Longitud maxima excedida"
		},
		pass: {
			required: 'Contrasena requerida',
			minlength: $.format('La contrasena debe tener al menos {0} caracteres'),			
			maxlength: "Longitud maxima excedida"
		},
		verify: {
			required: 'Verificacion de contrasena requerida',
			equalTo: 'La contrasenas son diferentes'			
		},
		email: {
			required: 'Email requerido',
			email: 'No es una direccion de email valida',		
			maxlength: "Longitud maxima excedida"
		},
		blue_address: {
			required: 'Direccion requerida'
		}
	};

	//BIG NOTE:
	//modify_form validation is in map.js
	//this is because there's no #modify_form to validate on document.ready
	//#modify_form is inserted during an Ajax Request placed in map.js/addMarker
	$('#insert_form').validate({
		rules: rules,
		messages: messages
	});
	
	$('#blue_form').validate({
		rules: rules,
		messages: messages
	});
	
	//validator personal rules
	$.validator.addMethod("time", function(value, element) { 
		  return /^\d\d?:\d\d$/.test(value); 
		}, "El formato para la hora es hh:mm");
	
	$.validator.addMethod("statusCheck", function(value, element) { 
		  return value == "1" || value == "0"; 
		}, "El status debe ser 1(disponible) o 0(no disponible)");
	
	$.validator.addMethod("validTime", function(value, element) { 
		  var t = value.split(':');
		  t[0] = parseInt(t[0]);
		  t[1] = parseInt(t[1]);		  
		  return t[0] >= 0 && t[0] <= 23 && t[1] >= 0 && t[1] <= 59;
		}, "La hora es invalida");
	});