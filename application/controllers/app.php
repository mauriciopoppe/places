<?php
	/**
	 *  Class app
	 */
	class App extends CI_Controller{
		
		function index()
		{
			$this->load->model('sucursal_model');
			$this->load->model('atm_model');
			$this->load->model('hospital_model');
			$this->load->model('hotel_model');
			$this->load->model('farmacia_model');
				
			$data = array();
			$data['sucursal'] = $this->sucursal_model->get_data();
			$data['atm'] = $this->atm_model->get_data();
			$data['hospital'] = $this->hospital_model->get_data();
			$data['hotel'] = $this->hotel_model->get_data();
			$data['farmacia'] = $this->farmacia_model->get_data();
			$data['title'] = 'Localizador de puntos de interes';
			$data['user_marker'] = true;
				
			$this->load->view('app_view', $data);
		}
		
		function login()
		{
			$this->load->model('admin_model');
			$row = $this->admin_model->is_admin();
			if(isset($row['id_admin']))
			{
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
				if($row == NULL)
					redirect('app');
				else
					echo 'failure';
			}
		}
		
	}