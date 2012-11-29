<?php
	$this->load->view('includes/header');
	$this->load->view('includes/banner');
?>
<!-- Login -->

<?php 
	$is_logged_in = $this->session->userdata('is_logged_in');
?>
<?php if(!isset($is_logged_in) || $is_logged_in == false): ?>
<div id="login" class="clear_float box_shadow_light">
	<div id="login_form">
		<?php 
			echo form_open('admin', array('id' => 'login_form', 'autocomplete' => 'off'));
			echo form_label('Usuario', 'username');
			echo form_input('username', '', 'id="username"');
			echo form_label('Contrasena', 'password');
			echo form_password('password', '', 'id="password"');
			echo form_submit('submit', 'LogIn', 'id="login_submit"');
			echo form_close();
		?>
	</div>
	<div id="login_label">
		Login
	</div>
</div>
<?php endif; ?>


<!-- Sidebar -->
<div id="sidebar">
	
	<?php $table = 'atm';	?>		
	<div class="expand box_shadow">
		
		<!-- On off slider -->
		<div class="slider_frame float_right">
			<span class="slider_button on">ON</span>
		</div>
		
		<div class="name">Atms</div>		
		
		<div class="data">
			<ul>
			<?php foreach($atm as $row): ?>				
				<li data-table="<?php echo $table; ?>"
					data-id="<?php echo $row['id' . '_' . $table]; ?>"
						class="<?php echo $row['alive'] != 1 ? 'dead' : ''; ?>">
					<?php echo $row['nombre']; ?>
				</li>
			<?php endforeach;?>
			</ul>
		</div>
	</div>
	
	<?php $table = 'sucursal';	?>			
	<div class="expand box_shadow">
	
		<!-- On off slider -->
		<div class="slider_frame float_right">
			<span class="slider_button on">ON</span>
		</div>
		
		<div class="name">Sucursales</div>
		
		<div class="data">
			<ul>
			<?php foreach($sucursal as $row): ?>				
				<li data-table="<?php echo $table; ?>"
					data-id="<?php echo $row['id' . '_' . $table]; ?>"
						class="<?php echo $row['alive'] != 1 ? 'dead' : ''; ?>">
					<?php echo $row['nombre']; ?>
				</li>
			<?php endforeach;?>
			</ul>
		</div>
	</div>
	
	<!-- DIRECTIONS PANEL -->	
	<div class="expand box_shadow">
		<div class="name">Direcciones</div>	
		<div id="panel">
			<p>
				La direccion sera mostrada en este contenedor
			</p>
			<!-- directions go here -->
		</div>	
	</div>
</div>

<!-- Main Content -->
<div id="map" class="box_shadow">

</div>	

<div class="clear_float"></div>

<!-- Gray box -->
<div id="screen"></div>

<div id="gray_box">
	<div id="gray_box_data">
		<img src="<?php echo base_url();?>images/logo.png" alt="UCB Logo" />
		
		<div id="gray_box_scroll">
			<h1>Bienvenido!!!</h1>
			<table>
				<tr>
					<td>
						Usted esta aqui
					</td>
					<td><img src="<?php echo base_url();?>images/new_place.png" alt="Usted esta aqui!!" /></td>
			</table>
			
			<p>
				Puede mover este marcador arrastrandolo al lugar deseado o <br />
				ingresar la calle deseada en el campo de entrada en la parte <br />
				superior derecha de la pagina						
			</p>
			
			<img class="box_shadow_light" src="<?php echo base_url();?>images/welcome/inst_3.png" alt="Welcome 3" />
			
			<hr />
			
			<h1>Leyenda</h1>
			<table>
				<tr>
					<th></th>
					<th>ATMs</th>
					<th>SUCURSALES</th>
				</tr>
				<tr>
					<td>Disponible</td>
					<td><img src="<?php echo base_url();?>images/atm/icons/atm_dark.png" 
							alt="Atm disponible" /></td>
					<td><img src="<?php echo base_url();?>images/sucursal/icons/sucursal_light.png" 
							alt="Sucursal disponible" /></td>
				</tr>
				<tr>
					<td>No Disponible</td>
					<td><img src="<?php echo base_url();?>images/atm/icons/atm_error.png" 
							alt="Atm no disponible" /></td>
					<td><img src="<?php echo base_url();?>images/sucursal/icons/sucursal_error.png" 
							alt="Sucursal no disponible" /></td>
				</tr>
			</table>
			
			<hr />
			
			<h1>Instrucciones</h1>
			<p>
				Para encontrar la ruta a una sucursal o atm simplemente haga click <br />
				en el marcador deseado o si prefiere haga click en el nombre de su <br />
				sucursal o atm favorito	en el menu de la izquierda:
			</p>
			
			<img class="box_shadow_light" src="<?php echo base_url();?>images/welcome/inst_1.jpg" alt="Welcome 1" />		
			
			<p>
				Las direcciones para llegar a su destino aparecen en el menu de la izquierda
			</p>
			
			<hr />
			
			<p>
				Tambien puede desactivar la visibilidad de algunos marcadores <br />
				haciendo click en los 'sliders' que aparecen a la derecha de los <br />
				atms y sucursales
			</p>
			
			<img class="box_shadow_light" src="<?php echo base_url();?>images/welcome/inst_4.png" alt="Welcome 4" />		
			
		</div>	
			
	</div>
	<div id="gray_box_close">
		<a id="close" href="#">
			<img src="<?php echo base_url();?>images/lightbox/close.png" alt="Close this frame" />
		</a>
	</div>
</div>
<!-- End gray box -->

<script type="text/javascript">
	$(function(){
		
		var screen = $('#screen');
		var gray_box = $('#gray_box');
		var fadeTime = 500;
		
		$('#instructions').click(function(){
			$('body').css('overflow', 'hidden');
			screen.css({
				width: $(document).width(),
				height: $(document).height()
			});

			//style screen
			gray_box.fadeIn(fadeTime);
			screen.fadeIn(fadeTime);
		});

		//close the screen on click
		screen.click(function(){
			screen.fadeOut(fadeTime);
			gray_box.fadeOut(fadeTime, function(){
				$('body').css('overflow', 'auto');
			});			
		});

		//if a#close is clicked then trigger #instructions click
		$('#close').click(function(){
			screen.trigger('click');
		});


		function show_or_hide(bool, table)
		{
			var regexp = new RegExp('^' + table);
			for(key in markerArray)
				if(regexp.test(key))
					markerArray[key].setVisible(bool);
		}
		
		<?php 
			//MAIN APP SLIDER TOGGLE
		?>
		//slider toggle
		//also unbind the click event from 		
		$('.slider_button').toggle(function(){
			$(this).removeClass('on').html('OFF');	
			$(this).parent().next()			
				.off('click')		//remove click event
				.next().slideUp();	//slide up to avoid selection

			//HIDE ALL MARKERS BELONGING TO THIS DIV.NAME
			var table = $(this).parent().next().next().find('li:first-child').attr('data-table');
			show_or_hide(false, table);			

		}, function(){			
			$(this).addClass('on').html('ON');
			//add div_name_click event
			$(this).parent().next().click(div_name_click);

			//SHOW ALL MARKERS BELONGING TO THIS DIV.NAME
			var table = $(this).parent().next().next().find('li:first-child').attr('data-table');
			show_or_hide(true, table);
		});

		//on start trigger click on instructions
		$('#instructions').trigger('click');
	});	
</script>

<?php 
	$this->load->view('includes/footer');
?>