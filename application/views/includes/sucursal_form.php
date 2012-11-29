<?php
	$table = 'sucursal';
	
	//functions to show data only if the form is "modifyForm"
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
	
	//sucursal_single is set in admin/get_byid
	//it's only set if a marker was clicked (so there was an Ajax call)
	if(isset($sucursal_single))
	{
		$data = $sucursal_single[0];
		$data['atencion_inicio'] = sprintf('%d:%02d', 
				floor($data['atencion_inicio'] / 60), 
				$data['atencion_inicio'] % 60);
		$data['atencion_fin'] = sprintf('%d:%02d', 
				floor($data['atencion_fin'] / 60), 
				$data['atencion_fin'] % 60);
		$crud = 'modify';
	}
	
	echo form_open_multipart('sucursal/' . $crud . '_' . $table, array('id' => $crud . "_form", 'autocomplete' => 'off'));
	label_input('Nombre Sucursal: ', 'nombre', chk('nombre', $data));
	
	//longitud
	echo form_label('Latitud: ', 'latitud');
	echo form_input(array('id' => 'latitud','name' => 'latitud', 'readonly' => 'readonly', 'value' => chk('latitud', $data)));		
	//latitud
	echo form_label('Longitud: ', 'longitud');
	echo form_input(array('id' => 'longitud','name' => 'longitud', 'readonly' => 'readonly', 'value' => chk('longitud', $data)));		
	
	label_input('Direccion: ', 'direccion', chk('direccion', $data));
	echo form_label('Atencion [hh:mm]:');
	echo form_input(array('name' => 'inicio', 'value' => chk('atencion_inicio', $data), 'placeholder' => 'Inicio en formato [24hh:mm]'));
	echo "<br />";
	echo form_input(array('name' => 'fin', 'value' => chk('atencion_fin', $data), 'placeholder' => 'Fin en formato [24hh:mm]'));
	label_input('Telefono: ', 'telefono', chk('telefono', $data));
	label_input('Detalles: ', 'detalles', chk('detalles', $data));
	echo form_label('Foto: ', 'imagen');
	echo form_upload(array('id' => 'imagen', 'name' => 'imagen'));
	echo form_label('Banco:', 'banco');
	echo form_dropdown('banco', $bancos, chk_dropdown('banco_id_banco', $data));
	echo form_label('Zona:', 'zona');
	echo form_dropdown('zona', $zonas, chk_dropdown('zona_id_zona', $data));
	if($crud == 'insert')
	{
		echo form_submit(array('name' => 'submit', 'value' => 'Insertar Sucursal'));		
	}
	else
	{
		echo form_hidden(array('id' => $data['id_sucursal']));
		echo form_submit(array('name' => 'submit', 'value' => 'Modificar Sucursal'));
	}
	echo form_close();
	
	//show delete button only if it's the modify_form
	if($crud == 'modify')
	{
		$crud = 'delete';
		echo form_open('sucursal/' . $crud . '_' . $table, array('id' => $crud . "_form", 'autocomplete' => 'off'));
		echo form_submit(array('name' => 'submit', 'value' => 'Eliminar Sucursal', 'class' => 'delete'));
		echo form_hidden(array('id' => $data['id_sucursal']));
		echo form_close();
	}