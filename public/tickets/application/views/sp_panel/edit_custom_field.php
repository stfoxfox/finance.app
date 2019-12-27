<div class="container marginTop">
	<div class="row">
		<?php include("sidebar.php"); ?>
        <div class="col-md-9">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_sp_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("sp_panel") ?>"><?php echo lang("short_bc_admin") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_edit_custom_field") ?></li>
					</ol>

					<?php echo form_open(site_url("sp_panel/edit_custom_field_pro/" . $field->ID)) ?>
					<?php
						$required = array(lang("pg_sp_required_option1") => 0, lang("pg_sp_required_option2") => 1);
						$types = array(lang("pg_sp_field_type_option1") => 0, lang("pg_sp_field_type_option2") => 1, lang("pg_sp_field_type_option3") => 2, lang("pg_sp_field_type_option4") => 3, lang("pg_sp_field_type_option5") => 4);
					?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_sp_edit_custom_field") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_field_name") ?></label>
									    <input type="text" class="form-control" id="name-in" name="name" placeholder="" value="<?php echo $field->name ?>">
									    <span class="help-block"><?php echo lang("pg_sp_field_name_info") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_field_placeholder") ?></label>
									    <input type="text" class="form-control" id="name-in" name="placeholder" placeholder="" value="<?php echo $field->placeholder ?>">
									    <span class="help-block"><?php echo lang("pg_sp_field_placeholder_info") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="helper-in"><?php echo lang("pg_sp_helper_text") ?></label>
									    <input type="text" class="form-control" id="helper-in" name="helper" placeholder="" value="<?php echo $field->subtext ?>">
									    <span class="help-block"><?php echo lang("pg_sp_helper_text_info") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_required") ?></label>
									    <select name="required" class="form-control">
									    <?php
									    		foreach($required as $k=>$v) {
									    			if($v == $field->required) {
									    				echo"<option value='{$v}' selected>{$k}</option>";
									    			} else {
									    				echo"<option value='{$v}'>{$k}</option>";
									    			}
									    		}
									    	?>
									    </select>
									    <span class="help-block"><?php echo lang("pg_sp_required_info") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_field_type") ?></label>
									    <select name="fieldtype" class="form-control">
									    	<?php
									    		foreach($types as $k=>$v) {
									    			if($v == $field->type) {
									    				echo"<option value='{$v}' selected>{$k}</option>";
									    			} else {
									    				echo"<option value='{$v}'>{$k}</option>";
									    			}
									    		}
									    	?>
									    </select>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="selectoptions-in"><?php echo lang("pg_sp_select_options") ?></label>
									    <input type="text" class="form-control" id="selectoptions-in" name="selectoptions" placeholder="" value="<?php echo $field->selectoptions ?>">
									    <span class="help-block"><?php echo lang("pg_sp_select_options_info") ?></span>
									</div>
								</div>
							</div>

							<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_sp_update_custom_field") ?>">
						</div>
					</div>
					<?php echo form_close() ?>

				</div>

			</div>
		</div>
    </div>
</div>