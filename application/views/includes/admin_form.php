<?php
	$table = 'administrador';
	
	$crud = 'insert';
	if($show_data == 1)
	{
		$data = $admin_single[0];
		$crud = 'modify';
	}
	else
		$data = array();
		
	echo form_open('admin/' . $crud . '_' . $table, array('id' => $crud . "_form", 'autocomplete' => 'off'));
	label_input('Usuario: ', 'usuario', chk('usuario', $data));
	echo "<label class='error-user'></label>";
	label_pass('Contrasena: ', 'pass', chk('pass', $data));
	label_pass('Repetir contrasena: ', 'verify', chk('verifiy', $data));
	label_input('Nombres: ', 'nombre', chk('nombre', $data));
	label_input('Apellido Paterno: ', 'apellido_paterno', chk('apellido_paterno', $data));
	label_input('Apellido Materno: ', 'apellido_materno', chk('apellido_materno', $data));
	label_input('Telefono: ', 'telefono', chk('telefono', $data));
	label_input('Direccion: ', 'direccion', chk('direccion', $data));
	label_input('Email: ', 'email', chk('email', $data));
	
	if($crud == 'insert')
	{
		echo form_submit(array('name' => 'submit', 'value' => 'Insertar Administrador'));		
	}
	else
	{
		echo form_hidden(array('id' => $data['id_admin']));
		echo form_submit(array('name' => 'submit', 'value' => 'Modificar Administrador'));
	}
	echo form_close();
	
	//show delete button only if it's the modify_form
	if($crud == 'modify')
	{
		$crud = 'delete';
		echo form_open('admin/' . $crud . '_' . $table, array('id' => $crud . "_form", 'autocomplete' => 'off'));
		echo form_submit(array('name' => 'submit', 'value' => 'Eliminar Cuenta', 'class' => 'delete'));
		echo form_hidden(array('id' => $data['id_admin']));
		echo form_close();
	}
?>