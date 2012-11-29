//jQuery.validator.setDefaults({
//	debug: true,
//	success: "valid"
//});

$(document).ready(function(){
	
	rules = {
			nombre: "required",
			apellido_paterno: "required",
			apellido_materno: "required",
			direccion: "required",
			telefono: {
				required: true,
				digits: true,
				minlength: 7
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
			usuario: {
				required: true,
				minlength: 5
			},
			pass: {
				required: true,
				minlength: 5
			},
			verify: {
				required: true,
				equalTo: "#pass"
			},
			email: {
				required: true,
				email: true
			},
			//blue direction for the form inside the banner
			blue_address: {
				required: true
			}
		};

	messages = {
		nombre: "Nombre requerido",
		apellido_paterno: "Apellido paterno requerido",
		apellido_materno: "Apellido materno requerido",
		direccion: "Direccion requerida",
		telefono: {
			required: 'Telefono requerido',
			digits: 'El telefono solo puede contener digitos',
			minlength: $.format('El telefono debe tener al menos {0} digitos')			
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
		usuario: {
			required: 'Nombre de usuario requerido',
			minlength: $.format('El nombre de usuario debe tener al menos {0} caracteres')			
		},
		pass: {
			required: 'Contrasena requerida',
			minlength: $.format('La contrasena debe tener al menos {0} caracteres')			
		},
		verify: {
			required: 'Verificacion de contrasena requerida',
			equalTo: 'La contrasenas son diferentes'			
		},
		email: {
			required: 'Email requerido',
			email: 'No es una direccion de email valida'			
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