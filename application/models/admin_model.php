<?php
/**
 * Page-level DocBlock
 * @package places
 */
require_once 'entity_model.php';
	
/**
 * Class Admin_model which perform CRUD operations over the table
 * admin in the database
 */
	class Admin_model extends Entity_model{
		
		/**
		 * Default constructor (also sets the inherited variable table
		 * to the name of the table this class is supposed to control)
		 */
		function __construct(){
			parent::__construct();
			$this->table = 'admin';
		}
		
		/**
		 * Verifies the info sent through ajax to log in a user
		 * @return array|null
		 */
		function is_admin()
		{
			// gather info
			$user = $this->input->post('username');
			$password = sha1($this->input->post('password'));

			// $user is not valid so return null
			if(!$user)
				return NULL;
			
			// execute the query to check if the user is available in the database
			$query = $this->db->select('id_admin, usuario, contrasena')
				->from('admin')
				->where('usuario', $user)
				->where('contrasena', $password)
				->get();			
			$data = array();
			foreach($query->result() as $row)
				$data['id_admin'] = $row->id_admin;
			return $data;
		}
		
		/**
		 * Gathers all the info from the form passed as $_POST
		 * @return array
		 */ 
		function get_form_data()
		{
			$data = array(
					'usuario' => $this->input->post('usuario'),
					'contrasena' => sha1($this->input->post('pass')),
					'nombre' => $this->input->post('nombre'),
					'apellido_paterno' => $this->input->post('apellido_paterno'),
					'apellido_materno' => $this->input->post('apellido_materno'),
					'telefono' => $this->input->post('telefono'),
					'direccion' => $this->input->post('direccion'),
					'email' => $this->input->post('email')
			);
			return $data;
		}

		/**
		 * checks if the username already exists in the database
		 */
		function check_username() {
			$username = $this->input->post('usuario');
			$query = $this->db->select('usuario')
				->from('admin')
				->where('usuario', $username)
				->get();
			if ($query->num_rows() > 0) {
				echo "failure";
			} else {
				echo "success";
			}
		}
	}