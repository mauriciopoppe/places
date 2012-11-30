<?php
/**
 * Page-level DocBlock
 * @package places
 */

/**
 * Class Sucursal which perform CRUD operations over the table
 * sucursal in the database
 */

	class Sucursal extends CI_Controller{
		
		/**
		 * Default constructor (executed before any method of this class is called)
		 *
		 * @see CI_Controller::__construct()
		 * @see Entity_model::__construct()
		 * @see Sucursal_model::__construct()
		 */
		function __construct(){
			parent::__construct();
			$this->is_logged_in();
			$this->load->model('entity_model');
			$this->load->model('sucursal_model');
		}
		
		/**
		 * Default method (called if no arguments are passed in the url after /places/sucursal)
		 * Loads sucursal_view located in views/ and passes $data
		 * 
		 * @see Sucursal_model::get_data()
		 * @see Entity_model::get_names('zona')
		 */
		function index()
		{
			// gather the data from the database (all 'sucursals', banco and zona)
			$data['sucursal'] = $this->sucursal_model->get_data();
			$data['zonas'] = $this->entity_model->get_names('zona');
			$data['bancos'] = $this->entity_model->get_names('banco');

			// create some extra variables to be used in the view			
			$data['user_marker'] = true;
			$data['title'] = 'Localizador de sitios de interes';

			// load sucursal_view
			$this->load->view('sucursales_view', $data);
		}

		/**
		 * Inserts a sucursal in the database and then redirects to the sucursal main page
		 *
		 * @see sucursal_model::insert_data()
		 */				
		function insert_sucursal()
		{
			$this->sucursal_model->insert_data();
			redirect('sucursal');
		}
		
		/**
		 * Modifies a sucursal in the database and then redirects to the sucursal main page
		 *
		 * @see Sucursal_model::update()
		 */				
		function modify_sucursal()
		{
			$this->sucursal_model->update();
			redirect('sucursal');
		}
		
		/**
		 * Deletes a sucursal in the database and then redirects to the sucursal main page
		 *
		 * @see Sucursal_model::delete()
		 */				
		function delete_sucursal()
		{
			$this->sucursal_model->delete();
			redirect('sucursal');
		}
		
		/**
		 * Gets an element of the table sucursal identified with $id
		 *
		 * @see Sucursal_model::get_byid($id)
		 * @see Entity_model::get_names('zona')
		 */
		function get_byid($table)
		{
			$table_model = $table . '_model';
			// gather the id
			$id = $this->input->post('id');

			// gather the row using $id and also gather 'zonas' and 'bancos'
			$data[$table . '_single'] = $this->$table_model->get_byid($id);
			$data['bancos'] = $this->entity_model->get_names('banco');
			$data['zonas'] = $this->entity_model->get_names('zona');
			
			// load includes/atm_form and passing $data as an argument
			$this->load->view('includes/' . $table . '_form', $data);
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
	}