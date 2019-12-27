<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_login_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("login") ?>"><?php echo lang("short_bc_login") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_resetpw") ?></li>
					</ol>

					<p><?php echo lang("pg_login_resetpw") ?></p>
					
					<?php echo form_open(site_url("login/resetpw_pro/" . $token . "/" . $userid)) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_login_resetpw_header") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="password-in"><?php echo lang("pg_login_newpw") ?></label>
								    	<input type="password" class="form-control" id="password-in" name="npassword" />
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="password-in"><?php echo lang("pg_login_newpw_confirm") ?></label>
								    	<input type="password" class="form-control" id="password-in" name="npassword2" />
								    </div>
								</div>
						  	</div>

						  	<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_login_button_resetpw") ?>">

						</div>
					</div>
					<?php echo form_close() ?>
				</div>

			</div>
		</div>
    </div>
</div>