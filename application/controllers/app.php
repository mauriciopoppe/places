<?php
/**
 * Page-level DocBlock
 * @package places
 */

/**
 * Class App which perform CRUD operations over the tables
 * sucursal, atm, hospital, hotel and farmacia
 */
	class App extends CI_Controller{
		
		/**
		 * Default method (called if no arguments are passed in the url after /places/app)
		 * Loads app_view located in views/ and passes $data
		 */
		function index()
		{
			// load the required models
			$this->load->model('sucursal_model');
			$this->load->model('atm_model');
			$this->load->model('hospital_model');
			$this->load->model('hotel_model');
			$this->load->model('farmacia_model');
				
			// gather data from the database
			$data = array();
			$data['sucursal'] = $this->sucursal_model->get_data();
			$data['atm'] = $this->atm_model->get_data();
			$data['hospital'] = $this->hospital_model->get_data();
			$data['hotel'] = $this->hotel_model->get_data();
			$data['farmacia'] = $this->farmacia_model->get_data();

			// create some extra variables to be used in the view
			$data['title'] = 'Localizador de puntos de interes';
			$data['user_marker'] = true;
				
			// load the view
			$this->load->view('app_view', $data);
		}
		
		/**
		 * Tries to login an user as an admin, note that this method is actually an
		 * ajax petition so the lines echoed are returned as a response to that ajax request
		 * @return string success if it's an admin or failure otherwise
		 */
		function login()
		{
			// load the required model
			$this->load->model('admin_model');

			// check if the data entered in the inputs belongs to an existing user
			// if so then saves its info in this row
			$row = $this->admin_model->is_admin();

			// check if the row exists
			if(isset($row['id_admin']))
			{
				// create the session data for this admin
				$data = array(
						'id_admin' => $row['id_admin'],
						'username' => $this->input->post('username'),
						'is_logged_in' => true
				);
				$this->session->set_userdata($data);
				echo 'success';
			}
			else
			{
				// the user is not in the database
				if($row == NULL)
					redirect('app');
				else
					echo 'failure';
			}
		}
		
	}