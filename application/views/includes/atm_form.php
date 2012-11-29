<?php
	$table = 'atm';
	
	function chk($key, $cont){
		if(array_key_exists($key, $cont))
			return $cont[$key];
		return '';
	}
	
	function chk_dropdown($key, $cont){
		if(array_key_exists($key, $cont))
			return $cont[$key];
		return NULL;
	}
	
	function label_input($label_value, $id, $value)
	{
		echo form_label($label_value, $id);
		echo form_input(array('id' => $id,'name' => $id, 'value' => $value));		
	}
	
	$data = array();
	$crud = 'insert';
	if(isset($atm_single)) /* Change this line */
	{
		$data = $atm_single[0];
		$crud = 'modify';
	}
	
	echo form_open_multipart('atm/' . $crud . '_' . $table, array('id' => $crud . "_form", 'autocomplete' => 'off'));
	label_input('Nombre Atm: ', 'nombre', chk('nombre', $data));
	
	//longitud
	echo form_label('Latitud: ', 'latitud');
	echo form_input(array('id' => 'latitud','name' => 'latitud', 'readonly' => 'readonly', 'value' => chk('latitud', $data)));		
	//latitud
	echo form_label('Longitud: ', 'longitud');
	echo form_input(array('id' => 'longitud','name' => 'longitud', 'readonly' => 'readonly', 'value' => chk('longitud', $data)));		
	
	label_input('Direccion: ', 'direccion', chk('direccion', $data));
	label_input('Status: ', 'status', chk('status', $data));
	label_input('Detalles: ', 'detalles', chk('detalles', $data));
	echo form_label('Foto: ', 'imagen');
	echo form_upload(array('id' => 'imagen', 'name' => 'imagen'));
	echo form_label('Banco:', 'banco');
	echo form_dropdown('banco', $bancos, chk_dropdown('banco_id_banco', $data));
	echo form_label('Zona:', 'zona');
	echo form_dropdown('zona', $zonas, chk_dropdown('zona_id_zona', $data));
	if($crud == 'insert')
	{
		echo form_submit(array('name' => 'submit', 'value' => 'Insertar Atm'));		
	}
	else
	{
		echo form_hidden(array('id' => $data['id_atm']));
		echo form_submit(array('name' => 'submit', 'value' => 'Modificar Atm'));
	}
	echo form_close();
	
	//show delete button only if it's the modify_form
	if($crud == 'modify')
	{
		$crud = 'delete';
		echo form_open('atm/' . $crud . '_' . $table, array('id' => $crud . "_form", 'autocomplete' => 'off'));
		echo form_submit(array('name' => 'submit', 'value' => 'Eliminar Atm', 'class' => 'delete'));
		echo form_hidden(array('id' => $data['id_atm']));
		echo form_close();
	}