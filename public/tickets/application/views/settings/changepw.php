<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_settings_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("user_settings") ?>"><?php echo lang("short_bc_settings") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_changepw") ?></li>
					</ol>

					<p><?php echo lang("pg_settings_changepw_welcome") ?></p>
					
					<?php echo form_open(site_url("user_settings/changepw_pro/" . $this->security->get_csrf_hash())) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_settings_changepw") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="password-in"><?php echo lang("pg_settings_currentpw") ?></label>
								    	<input type="password" class="form-control" id="password-in" name="password" />
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="password-in"><?php echo lang("pg_settings_newpw") ?></label>
								    	<input type="password" class="form-control" id="password-in" name="npassword" />
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="password-in"><?php echo lang("pg_settings_newpw_con") ?></label>
								    	<input type="password" class="form-control" id="password-in" name="npassword2" />
								    </div>
								</div>
						  	</div>

						  	<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_settings_button_changepw") ?>">

						</div>
					</div>
					<?php echo form_close() ?>
				</div>

			</div>
		</div>
    </div>
</div>