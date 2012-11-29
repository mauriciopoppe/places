<?php
	$this->load->view('includes/header');
	$this->load->view('includes/banner');
?>
	<div id="mainContent">
		
		<?php 
			//form helper functions
			//they're outside [admin_form.php] because of redeclaration
			function chk($key, $cont){
				if(array_key_exists($key, $cont))
					return $cont[$key];
				return '';
			}
			
			function label_input($label_value, $id, $value=NULL)
			{
				echo form_label($label_value, $id);
				echo form_input(array('id' => $id,'name' => $id, 'value' => $value));
			}
			
			function label_pass($label_value, $id, $value)
			{
				echo form_label($label_value, $id);
				echo form_password(array('id' => $id,'name' => $id, 'value' => $value));
			}
		?>
		
		<!-- ********INSERT NEW ADMINS******** -->
		<div class="expand box_shadow">
			<div class="name">
				Insertar Nuevos Administradores
			</div>
			<div class="data">
				<?php
					$data['show_data'] = 0;
					$this->load->view('includes/admin_form', $data); 
				?>
			</div>
		</div>
		
		<!-- ********MODIFY CURRENT ADMIN INFO******** -->
		<div class="expand box_shadow">
			<div class="name">
				Modificar Informacion
			</div>
			<div class="data">
				<?php
					$data['show_data'] = 1;					
					$this->load->view('includes/admin_form', $data); 
				?>
			</div>
		</div>
	</div>
<?php 
	$this->load->view('includes/footer');
?>
	<script type="text/javascript">
		$(function(){				
			var allData = $('div.data');
			//$('div.data form label').css('display', 'inline');
			var inputs = $('div.data form input[type!=hidden]');
			inputs.after('<br />');			
			allData.css({
				'height': desiredMaxHeight + 'px',
				'overflow': 'auto'
			});
			allData.show();
			allData.unbind('click');

			$('#modify_form').validate({rules: rules, messages: messages});			
		});

	</script>