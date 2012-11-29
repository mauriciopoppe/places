<?php
	class App extends CI_Controller{
		
		function index()
		{
			$this->load->model('sucursal_model');
			$this->load->model('atm_model');
				
			$data = array();
			$data['sucursal'] = $this->sucursal_model->get_data();
			$data['atm'] = $this->atm_model->get_data();
			$data['title'] = 'Buscador de sucursales y atms del BNB';
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