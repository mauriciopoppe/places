<?php
	class Atm extends CI_Controller{
		
		function __construct(){
			parent::__construct();
			$this->is_logged_in();
			$this->load->model('entity_model');
			$this->load->model('atm_model');
		}
		
		/*
		 * ATMS MAIN FUNCTIONS
		*/
		function index()
		{
			$data['atm'] = $this->atm_model->get_data();
			$data['bancos'] = $this->entity_model->get_names('banco');
			$data['zonas'] = $this->entity_model->get_names('zona');
			$data['user_marker'] = true;
			$data['title'] = 'Buscador de sucursales y atms del BNB';
			$this->load->view('atms_view', $data);
		}
		
		function insert_atm()
		{
			//TODO: validate data using ajax DONE
			$this->atm_model->insert_data();
			redirect('atm');
		}
		
		function modify_atm()
		{
			$this->atm_model->update();
			redirect('atm');
		}
		
		function delete_atm()
		{
			$this->atm_model->delete();
			redirect('atm');
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