<?php
/**
 * Page-level DocBlock
 * @package places
 */
require_once 'entity_model.php';
	
/**
 * Class Atm_model which perform CRUD operations over the table
 * atm in the database
 */
	class Atm_model extends Entity_model{
		
		/**
		 * Default constructor (also sets the inherited variable table
		 * to the name of the table this class is supposed to control)
		 */
		function __construct(){
			parent::__construct();
			$this->table = 'atm';
		}
		
		/**
		 * Gathers the form data and also adds the property 'alive' to each
		 * row, this new property determines the color of the marker's icon shown
		 * in the application
		 * @return array
		 */
		function get_data()
		{
			$results = parent::get_data();
			// iterate over each row of the form
			foreach ($results as &$row)
			{
				// add property alive ans set it to 0 if this row status property is zero
				$row['alive'] = 1;
				if($row['status'] == 0)
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
					'status' => $this->input->post('status'),
					'detalles' => $this->input->post('detalles'),
					'banco_id_banco' => $this->input->post('banco'),
					'zona_id_zona' => $this->input->post('zona'),
					'admin_id_admin' => $this->session->userdata('id_admin')
			);
			return $data;
		}
	}