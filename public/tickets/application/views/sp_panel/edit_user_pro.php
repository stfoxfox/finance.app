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
					  <li><a href="<?php echo site_url("sp_panel/edit_user/") ?>"><?php echo lang("short_bc_edit_users") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_edit_user") ?></li>
					</ol>

					<?php echo form_open(site_url("sp_panel/edit_user_pro_pro/" . $agent->ID)) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_sp_edit_user") ?></div>
						<div class="panel-body">

							<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="name-in"><?php echo lang("pg_sp_name") ?></label>
								    	<input type="text" class="form-control" id="name-in" name="name" placeholder="" value="<?php echo $agent->name ?>">
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="email-in"><?php echo lang("pg_sp_email") ?></label>
								    	<input type="email" class="form-control" id="email-in" name="email" placeholder="" value="<?php echo $agent->email ?>">
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="password-in"><?php echo lang("pg_sp_password") ?></label>
								    	<input type="password" class="form-control" id="password-in" name="password" />
								    	<span class="help-block"><?php echo lang("pg_sp_user_changepw") ?></span>
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="password-in"><?php echo lang("pg_sp_access_level") ?></label>
								    	<select name="access_level" class="form-control">
								    	<?php $access = array(lang("pg_sp_access_level-2") => -2, lang("pg_sp_access_level-1") => -1, lang("pg_sp_access_level0") => 0, lang("pg_sp_access_level1") => 1, lang("pg_sp_access_level2") => 2, lang("pg_sp_access_level3") => 3, lang("pg_sp_access_level4") => 4); ?>
								    	<?php
								    		foreach($access as $k=>$v) {
								    			if($v == $agent->access_level) {
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

						  	<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_sp_update_user") ?>">

						</div>
					</div>
					<?php echo form_close() ?>


				</div>

			</div>
		</div>
    </div>
</div>