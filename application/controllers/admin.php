<?php
	class Admin extends CI_Controller{
		
		function __construct(){
			parent::__construct();
			$this->is_logged_in();
			$this->table = 'admin';
			$this->load->model('admin_model');
		}
		
		function index()
		{
			$data = array();
			$data['title'] = 'Localizador de sitios de interes';				
			$this->load->view('admin_view', $data);
		}
		
		function is_logged_in()
		{
			$is_logged_in = $this->session->userdata('is_logged_in');
			if(!isset($is_logged_in) || $is_logged_in == false)
				redirect('app');
		}
				
		function logout()
		{
			$this->session->sess_destroy();
			redirect('app');
		}
		
		//ADMIN REGISTRATION MAIN FUNCTIONS
		function admin_options()
		{
			//get the data by id
			$id = $this->session->userdata('id_admin');
			$data['admin_single'] = $this->admin_model->get_byid($id);
			$data['title'] = 'Localizador de sitios de interes';
			$this->load->view('admin_options_view', $data);				
		}

		function insert_administrador()
		{
			//TODO: validate data using ajax DONE
			$this->admin_model->insert_data();
			redirect('admin/admin_options');
		}
		
		function modify_administrador()
		{
			$this->admin_model->update();
			redirect('admin/admin_options');
		}
		
		function delete_administrador()
		{
			$this->admin_model->delete();
			redirect('admin/admin_options');
		}
	}