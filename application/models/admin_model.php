<?php
	require_once 'entity_model.php';
	class Admin_model extends Entity_model{
		
		function __construct(){
			parent::__construct();
			$this->table = 'admin';
		}
		
		function is_admin()
		{
			$user = $this->input->post('username');
			$password = sha1($this->input->post('password'));
			if(!$user)
				return NULL;
			
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
	}