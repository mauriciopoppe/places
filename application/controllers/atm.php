<?php
/**
 * Page-level DocBlock
 * @package places
 */

/**
 * Class Atm which perform CRUD operations over the table
 * atm in the database
 */
	class Atm extends CI_Controller{
		
		/**
		 * Default constructor (executed before any method of this class is called)
		 *
		 * @see CI_Controller::__construct()
		 * @see Entity_model::__construct()
		 * @see Atm_model::__construct()
		 */
		function __construct(){
			parent::__construct();
			$this->is_logged_in();
			$this->load->model('entity_model');
			$this->load->model('atm_model');
		}
		
		/**
		 * Default method (called if no arguments are passed in the url after /places/atm)
		 * Loads atms_view located in views/ and passes $data
		 */
		function index()
		{
			// gather the data from the database
			$data['atm'] = $this->atm_model->get_data();
			$data['bancos'] = $this->entity_model->get_names('banco');
			$data['zonas'] = $this->entity_model->get_names('zona');

			// create some extra variables to be used in the view
			$data['user_marker'] = true;
			$data['title'] = 'Buscador de sucursales y atms del BNB';

			// load the view
			$this->load->view('atms_view', $data);
		}
		
		/**
		 * Inserts an atm in the database and then redirects to the atm main page
		 *
		 * @see Atm_model::insert_data()
		 */
		function insert_atm()
		{
			//TODO: validate data using ajax DONE
			$this->atm_model->insert_data();
			redirect('atm');
		}
		
		/**
		 * Modifies an atm in the database and then redirects to the atm main page
		 *
		 * @see Atm_model::update()
		 */
		function modify_atm()
		{
			$this->atm_model->update();
			redirect('atm');
		}
		
		/**
		 * Deletes an atm in the database and then redirects to the atm main page
		 *
		 * @see Atm_model::delete()
		 */		
		function delete_atm()
		{
			$this->atm_model->delete();
			redirect('atm');
		}
		
		/**
		 * Gets an element of the table ATM identified with $id
		 *
		 * @see Atm_model::get_byid($id)
		 * @see Entity_model::get_names('banco')
		 * @see Entity_model::get_names('zona')
		 */
		function get_byid($table)
		{
			$table_model = $table . '_model';
			// gather the id
			$id = $this->input->post('id');

			// gather the row using $id and also gather 'bancos' and 'zonas'
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