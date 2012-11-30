<?php
/**
 * Page-level DocBlock
 * @package places
 */

/**
 * Class Entity model which performs CRUD operations in the database
 */
	class Entity_model extends CI_Model{
	
		/**
		 * This variable is inherited to admin_model, atm_model, farmacia_model
		 * hospital_model and sucursal_model and represents the table
		 * we're working with 
		 * @var string The table to work with
		 */	
		var $table;
		
		/**
		 * Default constructor
		 */
		function __construct()
		{
			parent::__construct();
		}		
		
		/**
		 * Gathers all the rows from $table stored in the database
		 * (the query is 'SELECT * FROM $table')
		 * @return array
		 */
		function get_data()
		{
			$result = $this->db->get($this->table)->result_array();
			return $result;
		}
		
		/**
		 * Gathers the id and name of each row of $table and creates an
		 * array to map each id to that name
		 * (the query is 'SELECT id_$table, nombre FROM $table')
		 * @return array
		 */
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

		/**
		 * Inserts a row in the table $table gathering the info from the form
		 * and checking if it's the table admin to insert an image or not
		 */
		function insert_data(){
			$the_table = $this->table . '_model';

			// gather all the info from the form
			$data = $this->$the_table->get_form_data();
			
			// only upload a photo if the table to insert is not admin
			if($this->table != 'admin')
			{
				// try to upload the file using the next id for the table
				if(($db_image_filename = $this->do_upload($this->get_nextAutoInc())) != NULL)
					$data['imagen'] = $db_image_filename;
				else
					$data['imagen'] = 'no-picture.gif';
			}
			print_r($data);
			$this->db->insert($this->table, $data);
		}
		
		/**
		 * Updates a row in the table $table gathering the info from the form
		 * and checking if it's the table admin to insert an image or not
		 */
		function update()
		{
			$the_table = $this->table . '_model';

			// gather all the info from the form
			$data = $this->$the_table->get_form_data();

			// first check if the user uploaded a file
			if(is_uploaded_file($_FILES['imagen']['tmp_name']))
			{
				$db_image_filename = $this->do_upload($this->input->post('id'));
				$data['imagen'] = $db_image_filename;
			}
			$this->db->where('id_' . $this->table, $this->input->post('id'));
			$this->db->update($this->table, $data);
		}
		
		/**
		 * Uploads a photo in the server, the photo is stored in /images/$table/,
		 * the name of the photo in the server is $table$id, also this method
		 * creates a thumbnail of the photo so it can be shown in the preview of the site
		 * @return string|null Returns a string if the upload process was successful
		 */
		function do_upload($id)
		{
			// image upload
			// set the filename and the extension of the file
			$filename = $this->table . $id . "." .  pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
			// set the configuration options to upload the file
			$config = array(
					'upload_path'   => realpath(APPPATH . '../images/' . $this->table . '/full_size'),
					'allowed_types' => 'gif|jpg|png|jpeg',
					'file_name' => $filename,
					'overwrite' => true
			);
			
			// upload the image
			$this->load->library('upload', $config);
			if($this->upload->do_upload('imagen'))
			{
				// create the thumbnail
				$this->create_thumbnail($filename);
				return $filename;
			}
			else
			{
				// echo $this->upload->display_errors();
				return NULL;
			}
		}
		
		/**
		 * Creates a thumbnail of the photo uploaded
		 */
		function create_thumbnail($name)
		{
			// get information about the image
			$image_data = $this->upload->data();
				
			// image library helper
			$config = array(
					'source_image' => $image_data['full_path'],
					'new_image' => realpath(APPPATH . '../images/' . $this->table . '/thumb'),
					'maintain_ratio' => true,
					'width' => 100,
					'height' => 100,
					'overwrite' => true
			);
			$this->load->library('image_lib', $config);
			// make the helper resize the image
			$this->image_lib->resize();
		}
		
		/**
		 * Deletes a row from $table
		 * (the query is 'DELETE from $table where id_$table = $id')		 
		 */
		function delete()
		{
			// gather the id and create the first part of the query
			$this->db->where('id_' . $this->table, $this->input->post('id'));
			$this->db->delete($this->table);
		}
		
		/**
		 * Select a row from $table identified by $id
		 * (the query is 'SELECT * from $table where id_$table = $id')		 
		 * @return array
		 */
		function get_byid($id)
		{
			$query = $this->db->where('id_' . $this->table, $id)
					->get($this->table);
			return $query->result_array();
		}
		
		/*
		 * get the next autoinc value for $table
		 * http://narendravaghela.com/mysql/mysql-get-next-auto-increment-value-in-a-mysql-table/
         */
		function get_nextAutoInc()
		{
			$query = $this->db->query("SHOW TABLE STATUS LIKE '$this->table'");
			$nextAutoInc = "";
			foreach($query->result() as $row)
				$nextAutoInc = $row->Auto_increment;
			return $nextAutoInc;
		}
	}