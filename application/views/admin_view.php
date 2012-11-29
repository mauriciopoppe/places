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
		<img src="<?php echo base_url(); ?>images/atm/icons/atm_big.jpg" alt="Sucursal" />
		<div class="mask">
			<h1>Atms</h1>
			<p>Some text here</p>
			<a href="<?php echo site_url('atm'); ?>" class="info">Editar Atms</a>
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