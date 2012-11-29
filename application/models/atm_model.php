<?php
	require_once 'entity_model.php';
	class Atm_model extends Entity_model{
		
		function __construct(){
			parent::__construct();
			$this->table = 'atm';
		}
		
		function get_data()
		{
			$results = parent::get_data();
			foreach ($results as &$row)
			{
				$row['alive'] = 1;
				if($row['status'] == 0)
					$row['alive'] = 0;
			}
			return $results;
		}
		
		function get_form_data()
		{
			$data = array(
					'nombre' => $this->input->post('nombre'),
					'latitud' => $this->input->post('latitud'),
					'longitud' => $this->input->post('longitud'),
					'direccion' => $this->input->post('direccion'),
					'status' => $this->input->post('status'),
					'detalles' => $this->input->post('detalles'),
					'banco_id_banco' => $this->input->post('banco'),
					'zona_id_zona' => $this->input->post('zona'),
					'admin_id_admin' => $this->session->userdata('id_admin')
			);
			return $data;
		}
	}