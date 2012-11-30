<?php
/**
 * Page-level DocBlock
 * @package places
 */

/**
 * Class Admin which perform CRUD operations over the table
 * admin in the database
 */
	class Admin extends CI_Controller{
		
		/**
		 * Default constructor (executed before any method of this class is called)
		 *
		 * @see Admin_model::__construct()
		 */
		function __construct(){
			parent::__construct();
			$this->is_logged_in();
			$this->table = 'admin';
			$this->load->model('admin_model');
		}
		
		/**
		 * Default method (called if no arguments are passed in the url after /places/admin)
		 * Loads admin_view located in views/ and passes $data
		 */
		function index()
		{
			$data = array();
			$data['title'] = 'Localizador de sitios de interes';				
			$this->load->view('admin_view', $data);
		}
		
		/**
		 * Checks if an admin is logged in (using the session var $_SESSION[is_logged_in])
		 * if no admin is logged in then redirect to the main page
		 */
		function is_logged_in()
		{
			$is_logged_in = $this->session->userdata('is_logged_in');
			if(!isset($is_logged_in) || $is_logged_in == false)
				redirect('app');
		}
				
		/**
		 * Destroys the current session and redirects to the main page
		 */
		function logout()
		{
			$this->session->sess_destroy();
			redirect('app');
		}
		
		//ADMIN REGISTRATION MAIN FUNCTIONS
		/**
		 * This method is executed when the users clicks in 'Editar administradores'
		 * It gathers the $id of the admin who is logged in and also all its info,
		 * the using that info it loads /views/admin_options_view
		 *
		 */
		function admin_options()
		{
			//get the data by id
			$id = $this->session->userdata('id_admin');
			$data['admin_single'] = $this->admin_model->get_byid($id);
			$data['title'] = 'Localizador de sitios de interes';
			$this->load->view('admin_options_view', $data);				
		}

		/**
		 * Inserts an administrador in the database and then redirects to the admin
		 * options page
		 *
		 * @see Admin_model::insert_data()
		 */
		function insert_administrador()
		{
			$this->admin_model->insert_data();
			redirect('admin/admin_options');
		}
		
		/**
		 * Modifies an administrador in the database and then redirects to the admin
		 * options page
		 *
		 * @see Admin_model::update()
		 */
		function modify_administrador()
		{
			$this->admin_model->update();
			redirect('admin/admin_options');
		}
		
		/**
		 * Deletes an administrador in the database and then redirects to the admin
		 * options page
		 *
		 * @see Admin_model::delete()
		 */
		function delete_administrador()
		{
			$this->admin_model->delete();
			redirect('admin/admin_options');
		}

		function check_username() {
			$this->admin_model->check_username();
		}
	}