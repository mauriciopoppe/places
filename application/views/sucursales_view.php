<?php
	$this->load->view('includes/header');
	$this->load->view('includes/banner');
?>
	<div id="sidebar">
		
		<!-- ********INSERT DATA******** -->
		<div id="insert" class="expand box_shadow">
			<div class="name">
				Insertar Nuevas Sucursales
				<!-- Maybe add more title data here -->
			</div>
			<div class="data">
				<?php
					$data = array(); 
					$this->load->view('includes/sucursal_form', $data); 
				?>
			</div>
		</div>
		
		<!-- ********MODIFY AND DELETE DATA******** -->
		<div id="modify" class="expand box_shadow">
			<div class="name">
				Modificar Sucursales Existentes
				<!-- Maybe add more title data here -->
			</div>
			<div class="data">
				<p>
					Para modificar los datos, haga click en un marcador a la derecha
				</p>
			</div>
		</div>
	</div>
	<!-- Main Content -->
	<div id="map" class="box_shadow">
	
	</div>
<?php 
	$this->load->view('includes/footer');
?>