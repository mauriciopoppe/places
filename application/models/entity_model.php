<?php
	class Entity_model extends CI_Model{
		
		var $table;
		
		function __construct()
		{
			parent::__construct();
		}		
		
		function get_data()
		{
			$result = $this->db->get($this->table)->result_array();
			return $result;
		}
		
		function get_names($table)
		{
			$query = $this->db->select("id_$table, nombre")
						->from($table)->get();
			
			$id = "id_$table";
			$nombre = "nombre";
			
			$bancos = array();
			foreach($query->result() as $row)
				$bancos[$row->$id] = $row->$nombre;
			
			return $bancos;
		}	

		function insert_data(){
			$the_table = $this->table . '_model';
			$data = $this->$the_table->get_form_data();
			
			//only upload a photo if the table to insert is not admin
			if($this->table != 'admin')
			{
				//try to upload the file using the next id for the table
				if(($db_image_filename = $this->do_upload($this->get_nextAutoInc())) != NULL)
					$data['imagen'] = $db_image_filename;
				else
					$data['imagen'] = 'no-picture.gif';
			}
			print_r($data);
			$this->db->insert($this->table, $data);
		}
		
		function update()
		{
			$the_table = $this->table . '_model';
			$data = $this->$the_table->get_form_data();
			//first check if the user uploaded a file
			if(is_uploaded_file($_FILES['imagen']['tmp_name']))
			{
				$db_image_filename = $this->do_upload($this->input->post('id'));
				$data['imagen'] = $db_image_filename;
			}
			$this->db->where('id_' . $this->table, $this->input->post('id'));
			$this->db->update($this->table, $data);
		}
		
		function do_upload($id)
		{
			//image upload
			$filename = $this->table . $id . "." .  pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
			$config = array(
					'upload_path'   => realpath(APPPATH . '../images/' . $this->table . '/full_size'),
					'allowed_types' => 'gif|jpg|png|jpeg',
					'file_name' => $filename,
					'overwrite' => true
			);
			
			$this->load->library('upload', $config);
			if($this->upload->do_upload('imagen'))
			{
				//create the thumbnail :D finally
				$this->create_thumbnail($filename);
				return $filename;
			}
			else
			{
				//echo $this->upload->display_errors();
				return NULL;
			}
		}
		
		function create_thumbnail($name)
		{
			//get information about the image
			$image_data = $this->upload->data();
				
			//image library
			$config = array(
					'source_image' => $image_data['full_path'],
					'new_image' => realpath(APPPATH . '../images/' . $this->table . '/thumb'),
					'maintain_ratio' => true,
					'width' => 100,
					'height' => 100,
					'overwrite' => true
			);
			$this->load->library('image_lib', $config);
			$this->image_lib->resize();
		}
		
		function delete()
		{
			$this->db->where('id_' . $this->table, $this->input->post('id'));
			$this->db->delete($this->table);
		}
		
		function get_byid($id)
		{
			$query = $this->db->where('id_' . $this->table, $id)
					->get($this->table);
			return $query->result_array();
		}
		
		//get the next autoinc value for the given table
		//http://narendravaghela.com/mysql/mysql-get-next-auto-increment-value-in-a-mysql-table/
		function get_nextAutoInc()
		{
			$query = $this->db->query("SHOW TABLE STATUS LIKE '$this->table'");
			$nextAutoInc = "";
			foreach($query->result() as $row)
				$nextAutoInc = $row->Auto_increment;
			return $nextAutoInc;
		}
	}