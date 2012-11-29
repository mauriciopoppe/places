<?php
	class Sucursal extends CI_Controller{
		
		function __construct(){
			parent::__construct();
			$this->is_logged_in();
			$this->load->model('entity_model');
			$this->load->model('sucursal_model');
		}
		
		/*
		 * SUCURSALES MAIN FUNCTIONS
		*/
		function index()
		{
			$data['sucursal'] = $this->sucursal_model->get_data();
			$data['bancos'] = $this->entity_model->get_names('banco');
			$data['zonas'] = $this->entity_model->get_names('zona');
			$data['user_marker'] = true;
			$data['title'] = 'Buscador de sucursales y atms del BNB';
			$this->load->view('sucursales_view', $data);
		}
		
		function insert_sucursal()
		{
			//TODO: validate data using ajax DONE
			$this->sucursal_model->insert_data();
			redirect('sucursal');			
		}
		
		function modify_sucursal()
		{
			$this->sucursal_model->update();
			redirect('sucursal');
		}
		
		function delete_sucursal()
		{
			$this->sucursal_model->delete();
			redirect('sucursal');
		}
		
		//AJAX FUNCTION to put data in the modify_form
		function get_byid($table)
		{
			$table_model = $table . '_model';
			$id = $this->input->post('id');
			$data[$table . '_single'] = $this->$table_model->get_byid($id);
			$data['bancos'] = $this->entity_model->get_names('banco');
			$data['zonas'] = $this->entity_model->get_names('zona');
			$this->load->view('includes/' . $table . '_form', $data);
		}
		
		function is_logged_in()
		{
			$is_logged_in = $this->session->userdata('is_logged_in');
			if(!isset($is_logged_in) || $is_logged_in == false)
				redirect('app');
		}
	}