<?php
	require_once 'entity_model.php';

	class Sucursal_model extends Entity_model{
		
		function __construct(){
			parent::__construct();
			$this->table = 'sucursal';
		}
		
		function get_data(){
			$results = parent::get_data();
			foreach ($results as &$row)
			{
				$row['alive'] = 1;
				$time_now = intval(date('G')) * 60 + intval(date('i'));
				if($row['atencion_inicio'] > $time_now || $row['atencion_fin'] < $time_now ||
						date('N') >= 6)	//today it's saturday or sunday
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
					'atencion_inicio' => $this->split_hour($this->input->post('inicio')),
					'atencion_fin' => $this->split_hour($this->input->post('fin')),
					'telefono' => $this->input->post('telefono'),
					'detalles' => $this->input->post('detalles'),
					'banco_id_banco' => $this->input->post('banco'),
					'zona_id_zona' => $this->input->post('zona'),
					'admin_id_admin' => $this->session->userdata('id_admin')
			);
			return $data;
		}
		
		function split_hour($hour)
		{
			$data = explode(':', $hour);
			return intval($data[0]) * 60 + intval($data[1]);
		}			
	}