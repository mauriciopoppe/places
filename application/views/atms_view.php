<?php
	$this->load->view('includes/header');
	$this->load->view('includes/banner');
?>
	<div id="sidebar">
		
		<!-- ********INSERT DATA******** -->
		<div id="insert" class="expand box_shadow">
			<div class="name">
				Insertar Nuevos Atms
				<!-- Maybe add more title data here -->
			</div>
			<div class="data">
				<?php
					$data = array(); 
					$this->load->view('includes/atm_form', $data); 
				?>
			</div>
		</div>
		
		<!-- ********MODIFY AND DELETE DATA******** -->
		<div id="modify" class="expand box_shadow">
			<div class="name">
				Modificar Atms Existentes
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