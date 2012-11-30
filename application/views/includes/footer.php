<div class="clear_float"></div>

<?php 
	/********** TEMPLATE **********/
?>
<div id="marker_container" class="hidden">
		
		<script id="template" type="text/x-handlebars-template">
		<div id="fix_height">
	
			<div class="float_left" id="infowindow_content">
				<h2>{{nombre}}</h2>
				<p>
					<span>Direccion: </span>{{direccion}}
				</p>
				<p>
					<span>Detalles: </span>{{detalles}}
				</p>
				{{#if telefono}}
					<p>
						<span>Telefono: </span>{{telefono}}
					</p>
					<p>
						<span>Atencion: </span>{{inicio}} - {{fin}}
					</p>
				{{/if}}
				{{#if estrellas}}
					<p>
						<span>Estrellas: </span>
						<img src="<?php echo base_url(); ?>images/estrellas/{{estrellas}}.png" alt="Estrellas">
					</p>
				{{/if}}
		
			</div>

			<!-- Image -->
			<div class="float_right">
				<a rel="lightbox" href="{{full}}" 
						title="Nombre: {{nombre}} - Direccion: {{direccion}}" class="box_shadow_light">
					<img id="thumb_image" src="{{thumb}}" alt="{{nombre}}" />
				</a>
			</div>
		</div>			
		</script>
</div>

<div class="footer">
	<ul>
		<li>
			&copy; 2012
		</li>
		<?php if(uri_string(current_url()) == 'app'):?>			
		<li>
			<a id="instructions" class="clear_float">Acerca de esta aplication</a>
		</li>
		<?php endif; ?>
		<li>
			<a href="https://developers.google.com/maps/terms">Google TOS</a>
		</li>
	</ul>
</div>

<?php 
	//THE FOLLOWING SCRIPT IS HERE TO MIX JAVASCRIPT AND PHP
	//if this is on a separate file then the PHP code would not work!
?>
<script type="text/javascript">
$(document).ready(function(){

	//store some variables
	var loginLabel = $('#login_label');
	var loginForm = $('#login_form');
	loginForm.hide();
	var username = $('#username');
	var password = $('#password');	

	//set the host
	host = '<?php echo base_url(); ?>';
	
	<?php 
		// INITIALLY HIDE ALL DATA
	?>
	
	var allData = $('div.data');
	allData.hide();	
	
	<?php if(isset($sucursal) || isset($atm) || isset($hospital) || isset($hotel) || isset($farmacia)): ?>	
		var the_map = showMap();
	<?php endif; ?>

	<?php
		/************ SHOW INSERT MARKER************/
		//call the INSERT_MARKER function only if there's a variable
		//$insert_marker (defined in the admin/sucursal)
		if(isset($user_marker)):
	?>
		userMarker = showUserMarker(the_map, '<?php echo base_url(); ?>' + 'images/', 'new_place.png');
		//console.log(userMarker);
	<?php endif; ?>
		
	<?php if(isset($sucursal)): ?>
		/************ SHOW SUCURSALES MARKERS************/
		var jsonSucursales = <?php echo json_encode($sucursal); ?>;
		ajaxUrl = '<?php echo site_url('sucursal/get_byid/sucursal'); ?>';
		showMarkers(the_map, jsonSucursales, '<?php echo base_url(); ?>images/sucursal/icons/', 'sucursal_light.png');

	<?php endif; ?>

	<?php if(isset($atm)): ?>
		/************ SHOW ATM MARKERS************/
		var jsonAtms = <?php echo json_encode($atm); ?>;
		ajaxUrl = '<?php echo site_url('atm/get_byid/atm'); ?>';
		showMarkers(the_map, jsonAtms, '<?php echo base_url(); ?>images/atm/icons/', 'atm_dark.png');
	<?php endif; ?>
	
	<?php if(isset($hospital)): ?>
		/************ SHOW HOSPITAL MARKERS************/
		var jsonHospitales = <?php echo json_encode($hospital); ?>;
		ajaxUrl = '<?php echo site_url('hospital/get_byid/hospital'); ?>';
		showMarkers(the_map, jsonHospitales, '<?php echo base_url(); ?>images/hospital/icons/', 'hospital_dark.png');
	<?php endif; ?>

	<?php if(isset($farmacia)): ?>
		/************ SHOW FARMACIA MARKERS************/
		var jsonFarmacia = <?php echo json_encode($farmacia); ?>;
		ajaxUrl = '<?php echo site_url('farmacia/get_byid/farmacia'); ?>';
		showMarkers(the_map, jsonFarmacia, '<?php echo base_url(); ?>images/farmacia/icons/', 'farmacia_dark.png');
	<?php endif; ?>
	
	<?php if(isset($hotel)): ?>
		/************ SHOW HOTEL MARKERS************/
		var jsonHotel = <?php echo json_encode($hotel); ?>;
		ajaxUrl = '<?php echo site_url('hotel/get_byid/hotel'); ?>';
		showMarkers(the_map, jsonHotel, '<?php echo base_url(); ?>images/hotel/icons/', 'hotel_dark.png');
	<?php endif; ?>
	
	// login form ajax check
	$('#login_submit').click(function(){
		var loginFormData = {
			username: username.val(),
			password: password.val()			
		};
		
		$.ajax({
			url: '<?php echo site_url('app/login'); ?>',
			type: 'POST',
			data: loginFormData,
			success: function(msg){
				if(msg == 'success')
					window.location = "<?php echo site_url('admin'); ?>";
				else
					loginLabel.html('Lo sentimos, el usuario y/o password estan incorrectos');
			}
		});
		
		return false;
	});

	<?php 
		//LOGIN SLIDE TOGGLE
	?>
	loginLabel.click(function(){
		loginForm.slideToggle();
		loginLabel.html('Login');
	});

	<?php 
		//ACCORDEON using slides
	?>
	div_name_click = function(){
		var currentData = $(this).next('.data');
		if(!currentData.is(':visible'))
		{
			//find all div.data diferent than this and slide them up
			var siblings = $(this).parent().siblings().find('.data');
			siblings.slideUp(); 
	
			//set the min size of a div.data = min(current_height, desired min length)
			//overflow: auto (show the scrollbar on the right if the content is
			//higher than the height of the parent container)
			//ie 500px
			
			//desiredMaxHeight defined in map.js
			var minHeight = Math.min(parseInt(currentData.css('height')), desiredMaxHeight);
			currentData.css('height', minHeight + 'px');
			currentData.css('overflow', 'auto');
			currentData.slideDown();
		}
	}
	
	$('div.name').click(div_name_click);

	<?php
		//APP SIDEBAR ul li directions to the user's marker  
		//https://developers.google.com/maps/documentation/javascript/directions
	?>
	$('div.data ul li').click(function(){
		
		//trigger marker click event
		//get the marker (which has a correspondence to this ul>li)
		var currentMarker = $(this).attr('data-table') + '_' + $(this).attr('data-id');
		google.maps.event.trigger(markerArray[currentMarker], 'click',{
			//do nothing here, just trigger the event
		});

	});

	<?php
		//FORM VALIDATION
		//Defined in js/validation_rules.js 
	?>

	<?php 
		//BLUE MARKER GEOCODING
		//method doGeocoding() defined in map.js
	?>
	$('#blue_form').submit(function(e){

		//check current time
		<?php if(isset($sucursal) || isset($atm) || isset($hospital) || isset($hotel) || isset($farmacia)):?>
			doGeocode(the_map, $('#blue_address').val());
		<?php endif; ?>
		e.preventDefault();
	});
});
</script>

</body>
</html>
