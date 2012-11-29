//initial center of the map
var center = new google.maps.LatLng(-16.500010, -68.132057);

//common infoWindow to be used in any infoWindow
var infoWindow;

//ajax_url (to fetch a marker data)
var ajaxUrl;

//light blue userMarker
var userMarker;

//the path shown in the map
var directionsPath;

//the service provided by google maps to get directions
var directionsService = new google.maps.DirectionsService();

//marker array (the trigger is ul>li click)
var markerArray;

//desired max height of the containers
var desiredMaxHeight = 500;

//validation rules and messages
var rules, messages;

//the hostname (to show the images)
var host;

//geocoder object
var geocoder;

//toogle button variable
var div_name_click;

function showMap()
{
	
	var options = {
		zoom: 16,
		
		//the center is Bueno esq. Av. Camacho
		center: center,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		
		//enable scale
		scaleControl: true,		
		
		//disable view control (not available in Bolivia)
		streetViewControl: false
		
		//disable zoom
		//zoomControl: false,
		//scrollwheel: false		
	};
	
	var map = new google.maps.Map(document.getElementById('map'), options);
	
	//init the directionsPath var
	directionsPath = new google.maps.DirectionsRenderer();
	//attach the directionsPath to the map
	directionsPath.setMap(map);
	//attach the directions to a panel
	directionsPath.setPanel(document.getElementById('panel'));
	
	//init geocoder
	geocoder = new google.maps.Geocoder();
	
	return map;	
}

function showUserMarker(map, imagesPath, image)
{
	//marker image
	var icon = new google.maps.MarkerImage(imagesPath + image);
	var marker = new google.maps.Marker({
		position: center,
		map: map,
		icon: icon,
		draggable: true,
		animation: google.maps.Animation.DROP,
		zIndex: 99,
		title: 'Move this marker'
	});	
	
	//set the initial position of the marker
	//truncate it to 6 decimal positions
	$('#latitud').val(marker.position.lat().toFixed(6));
	$('#longitud').val(marker.position.lng().toFixed(6));
	
	//get the marker lat & lng
	google.maps.event.addListener(marker, 'dragend', function(){
		$('#latitud').val(marker.position.lat().toFixed(6));
		$('#longitud').val(marker.position.lng().toFixed(6));
		$('#insert .name').trigger('click');
		$('#modify .data').html('Para modificar los datos, haga click en un marcador a la derecha');
	});
	
	google.maps.event.addListener(marker, 'click', function(){
		$('#insert .name').trigger('click');
		$('#modify .data').html('Para modificar los datos, haga click en un marcador a la derecha');
	});
	
	return marker;
}

function showMarkers(map, fakeAjax, iconsPath, image)
{	
	//create a marker array to hold (atms) and/or (sucursales)
	markerArray = new Object();
	
	//parse the object fake_ajax
	//BIGNOTE: the object was parsed in the view, these two lines are obsolete
	//var entity = JSON.stringify(fakeAjax);
	//entity = JSON.parse(entity);
	var entity = fakeAjax;
	var size = entity.length;
	
	//find the table name xD useless micro consumption
	//since it can be in the parameters of the functions
	var start = iconsPath.indexOf('images') + 7;
	var end = iconsPath.indexOf('/', start);
	var table = iconsPath.substr(start, end - start);
	
	for(var i = 0; i < size; ++i)
	{
		//create the marker
		var icon;
		if(entity[i]['alive'] == 1)
			icon = new google.maps.MarkerImage(iconsPath + image);
		else
			icon = new google.maps.MarkerImage(iconsPath + table + "_error.png");
		setTimeout(addMarker, i * 300, map, icon, entity, table, i);
	}
}

//converts minutes to hours:minutes
function m_to_h(time)
{
	var h = parseInt(time / 60);
	var m = time % 60;
	if(time % 60 < 10)
		m = '0' + m;
	return h + ':' + m;
}

function addMarker(map, icon, entity, table, i)
{
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(entity[i]['latitud'], entity[i]['longitud']),
		map: map,
		icon: icon,
		draggable: false,
		animation: google.maps.Animation.DROP,
		title: entity[i]['nombre']
	});
	
	var markerContainer = $('#marker_container');
	
	//compile the template (defined in includes/footer.php)
	var template = Handlebars.compile($('#template').html());
	
	//add an event listener
	(function(marker, i){
		
		/*********** TODO: attach a function [calc_dist] **************/
		/*********** TODO: attach a function [show_photos] **************/			
		google.maps.event.addListener(marker, 'click', function(){
			
			//set the images
			//default is set to no image
			var full_size = host + 'images/no-picture.gif';
			var thumb = host + 'images/no-picture.gif';
			if(entity[i]['imagen'] != '' && entity[i]['imagen'] != 'no-picture.gif')
			{
				var temp_image = entity[i]['imagen']; 
				full_size = host + 'images/' + table + '/full_size/' + temp_image;
				thumb = host + 'images/' + table + '/thumb/' + temp_image;
			}			
			entity[i]['thumb'] = thumb; 
			entity[i]['full'] = full_size;
			
			if('atencion_inicio' in entity[i])
			{
				entity[i]['inicio'] = m_to_h(entity[i]['atencion_inicio']);
				entity[i]['fin'] = m_to_h(entity[i]['atencion_fin']); 
			}
			
			console.log(entity[i]);
			
			//evaluate the template with the data entity[i]
			var template_html = template(entity[i]);
			//move the parsed data to the container
			markerContainer.html(template_html);
			
			//if there's an infoWindow already open, close it first
			if(infoWindow) infoWindow.close();
			
			//edit contents of the infoWindow
			infoWindow = new google.maps.InfoWindow({
				content: markerContainer.html()
			});
			
			//attach the infoWindow to the marker[i]
			infoWindow.open(map, marker);
			
			/* ADMIN ONLY */			
			//ajax call if there's a div modify
			if(document.getElementById('modify') != null)
			{
				//show the div#modify
				$('#modify .name').trigger('click');
				
				$.ajax({
					url: ajaxUrl,
					type: 'POST',
					data: {
						'id': entity[i]['id_' + table]
					},
					success: function(msg){
						$('#modify .data').fadeOut('fast', function(){							
							$('#modify .data').html(msg).delay(1);
							$('#modify .data').css('height', '500px');
							$(this).fadeIn('fast');

							//IMPORTANT: Validate the form only after it's been put into the dom
							//and the proper delay has been set
							console.log($('#modify_form'));
							$('#modify_form').validate({rules: rules, messages: messages});							
						});
					}
				});
				
								
			}
			
			/* MAIN APP ONLY */
			else
			{
				//set the current ul>li to selected
				$('#sidebar ul li').removeClass('selected');
				var id = entity[i]['id_' + table];
				$('#sidebar ul li[data-id=' + id + '][data-table=' + table + ']').addClass(function(){
					return $(this).attr('class') + ' selected';
				});
				
				
				setTimeout(function(){
					$('#sidebar ul li[data-id=' + id + '][data-table=' + table + ']')
						.closest('.data').prev().trigger('click');}, 2000);	
				
				//Google Maps directions
				//https://developers.google.com/maps/documentation/javascript/directions
				var entityMarkerLatLng = new google.maps.LatLng(
							entity[i]['latitud'],
							entity[i]['longitud']
						);
				
				var userMarkerLatLng = new google.maps.LatLng(
						userMarker.position.lat(),
						userMarker.position.lng()
					);
				
				var request = {
					origin: userMarkerLatLng,
					destination: entityMarkerLatLng,
					travelMode: google.maps.DirectionsTravelMode.WALKING
				};

				directionsService.route(request, function(response, status){
					if(status == google.maps.DirectionsStatus.OK)
					{
						
						//fadeIn and fadeOut the panel
						$('#panel').fadeOut('fast', function(){							
							directionsPath.setDirections(response);
							$(this).fadeIn('fast');
						});
						//change height of the panel to 2/3 of the desiredMinLength
						$('#panel').animate({height: desiredMaxHeight * 2 / 3 + 'px'});
					}
				});
			}
		});
		
	})(marker, i);
	
	//add the current marker to the markerArray
	markerArray[table + '_' + entity[i]['id_' + table]] = marker;
}

//Geocoding
//https://developers.google.com/maps/documentation/javascript/geocoding
function doGeocode(map, input)
{
	geocoder.geocode({
		'address': input + ', La Paz, Bolivia'
	}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK)
		{
			userMarker.setPosition(results[0].geometry.location);
			map.setCenter(userMarker.position);
		}
		else
		{
			alert('Lo sentimos, no se pudo ejecutar la accion exitosamente: ' + status);
		}
	});
}
