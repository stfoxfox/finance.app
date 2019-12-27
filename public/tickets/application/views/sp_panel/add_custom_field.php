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
					  <li class="active"><?php echo lang("short_bc_add_custom_field") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_custom_field_text") ?></p>

					<p><?php echo lang("pg_sp_delete_custom_field") ?></p>
					<?php echo form_open(site_url("sp_panel/add_custom_field_pro")) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_sp_add_custom_field") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_field_name") ?></label>
									    <input type="text" class="form-control" id="name-in" name="name" placeholder="" >
									    <span class="help-block"><?php echo lang("pg_sp_field_name_info") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_field_placeholder") ?></label>
									    <input type="text" class="form-control" id="name-in" name="placeholder" placeholder="">
									    <span class="help-block"><?php echo lang("pg_sp_field_placeholder_info") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="helper-in"><?php echo lang("pg_sp_helper_text") ?></label>
									    <input type="text" class="form-control" id="helper-in" name="helper" placeholder="">
									    <span class="help-block"><?php echo lang("pg_sp_helper_text_info") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_required") ?></label>
									    <select name="required" class="form-control"><option value="0"><?php echo lang("pg_sp_required_option1") ?></option><option value="1"><?php echo lang("pg_sp_required_option2") ?></option></select>
									    <span class="help-block"><?php echo lang("pg_sp_required_info") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_field_type") ?></label>
									    <select name="fieldtype" class="form-control"><option value="0"><?php echo lang("pg_sp_field_type_option1") ?></option><option value="1"><?php echo lang("pg_sp_field_type_option2") ?></option><option value="2"><?php echo lang("pg_sp_field_type_option3") ?></option><option value="3"><?php echo lang("pg_sp_field_type_option4") ?></option><option value="4"><?php echo lang("pg_sp_field_type_option5") ?></option></select>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="selectoptions-in"><?php echo lang("pg_sp_select_options") ?></label>
									    <input type="text" class="form-control" id="selectoptions-in" name="selectoptions" placeholder="">
									    <span class="help-block"><?php echo lang("pg_sp_select_options_info") ?></span>
									</div>
								</div>
							</div>

							<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_sp_button_add_custom_field") ?>">
						</div>
					</div>
					<?php echo form_close() ?>

				</div>

			</div>
		</div>
    </div>
</div>