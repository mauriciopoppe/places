<?php
	$this->load->view('includes/header');
	$this->load->view('includes/banner');
?>

<div id="mainContent">

	<div class="view view-first box_shadow">
		<img src="<?php echo base_url(); ?>images/sucursal/icons/sucursal_big.jpg" alt="Sucursal" />
		<div class="mask">
			<h1>Sucursales</h1>
			<p>Some text here</p>
			<a href="<?php echo site_url('sucursal'); ?>" class="info">Editar Sucursales</a>
		</div>
	</div>
	
	<div class="view view-first box_shadow">
		<img src="<?php echo base_url(); ?>images/atm/icons/atm_big.jpg" alt="Atm" />
		<div class="mask">
			<h1>Atms</h1>
			<p>Some text here</p>
			<a href="<?php echo site_url('atm'); ?>" class="info">Editar Atms</a>
		</div>
	</div>
	
	<div class="view view-first box_shadow">
		<img src="<?php echo base_url(); ?>images/hospital/icons/hospital_big.jpg" alt="Hospital" />
		<div class="mask">
			<h1>Hospitales</h1>
			<p>Some text here</p>
			<a href="<?php echo site_url('hospital'); ?>" class="info">Editar Hospitales</a>
		</div>
	</div>
	
	<div class="view view-first box_shadow">
		<img src="<?php echo base_url(); ?>images/hotel/icons/hotel_big.jpg" alt="Hotel" />
		<div class="mask">
			<h1>Hoteles</h1>
			<p>Some text here</p>
			<a href="<?php echo site_url('hotel'); ?>" class="info">Editar Hoteles</a>
		</div>
	</div>
	
	<div class="view view-first box_shadow">
		<img src="<?php echo base_url(); ?>images/farmacia/icons/farmacia_big.jpg" alt="Hotel" />
		<div class="mask">
			<h1>Farmacias</h1>
			<p>Some text here</p>
			<a href="<?php echo site_url('farmacia'); ?>" class="info">Editar Farmacias</a>
		</div>
	</div>
	
	<div class="view view-first box_shadow">
		<img src="<?php echo base_url(); ?>images/admin_big.jpg" alt="Administrator" />
		<div class="mask">
			<h1>Administradores</h1>
			<p>Some text here</p>
			<a href="<?php echo site_url('admin/admin_options'); ?>" class="info">Read more</a>
		</div>
	</div>
	
</div>
<script type="text/javascript">
	//redirect if the mask is clicked
	$(function(){
		$('div.mask').click(function(){
			window.location = $(this).find('a').attr('href');
			return false;
		});
	});
</script>

<?php 
	$this->load->view('includes/footer');
?>