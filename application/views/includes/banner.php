<div id="banner">
	
	
	<div id="search_bar">
	
		<a href="<?php echo base_url();?>app">
			<img src="<?php echo base_url();?>images/logo.jpg" alt="Logo" />
		</a>
		<?php 
			$is_logged_in = $this->session->userdata('is_logged_in');
		?>
			<?php 	//only show this part if a session has been set	?>
				<ul class="float_left">
					<li><?php echo anchor(site_url('app'), 'Home'); ?></li>
					<?php if(isset($is_logged_in) && $is_logged_in == true): ?>		
						<li>
							<?php echo anchor(site_url('admin'), 'Admin Page'); ?>
						</li>
						<li>
							Logged in as <span class="box_round"><?php echo $this->session->userdata('username'); ?></span>
						</li>
						<li>
							<?php echo anchor(site_url('admin/logout'), 'LogOut'); ?>
						</li>
					<?php endif; ?>	
				</ul>
		<?php 
			echo form_open('app/locate', 'id="blue_form"');
			echo form_input(array(
						'name' => 'blue_address',
						'id' => 'blue_address',
						'placeholder' => 'Ingresa una direccion'
					));
			echo form_submit('submit_direction', 'Enviar direccion');
			echo form_close();
		?>
	</div>
</div>
<div class="clear_float"></div>
