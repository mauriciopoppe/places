<?php
/**
 * Page-level DocBlock
 * @package places
 */
require_once 'entity_model.php';
	
/**
 * Class Sucursal_model which perform CRUD operations over the table
 * sucursal in the database
 */
	class Sucursal_model extends Entity_model{
		
		/**
		 * Default constructor (also sets the inherited variable table
		 * to the name of the table this class is supposed to control)
		 */
		function __construct(){
			parent::__construct();
			$this->table = 'sucursal';
		}
		
		/**
		 * Gathers the form data and also adds the property 'alive' to each
		 * row, this new property determines the color of the marker's icon shown
		 * in the application
		 * @return array
		 */
		function get_data(){
			$results = parent::get_data();
			foreach ($results as &$row)
			{
				$row['alive'] = 1;
				// the logic to determine the value of property alive is as follows:
				// check if now is between the attention times of this row
				// also check that today is a workday
				// if so then the row is valid
				$time_now = intval(date('G')) * 60 + intval(date('i'));
				if($row['atencion_inicio'] > $time_now || $row['atencion_fin'] < $time_now ||
						date('N') >= 6)	//today it's saturday or sunday
					$row['alive'] = 0;
			}
			return $results;
		}
		
		/**
		 * Gathers all the info from the form passed as $_POST
		 * @return array
		 */ 		
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
		
		/**
		 * Splits $hour and returns the time in minutes
		 * @return int
		 */
		function split_hour($hour)
		{
			$data = explode(':', $hour);
			return intval($data[0]) * 60 + intval($data[1]);
		}			
	}