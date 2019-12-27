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
					  <li class="active"><?php echo lang("short_bc_settings") ?></li>
					</ol>

					<img src="<?php echo base_url() ?>images/icons/gear_48.png" class="floatLeft right-margin" /> <?php echo lang("pg_settings_welcome") ?>
					<div class="clearfix"></div>
					<br /><br />
					<?php echo form_open(site_url("user_settings/update")) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_settings_yourset") ?></div>
						<div class="panel-body">

							<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="name-in"><?php echo lang("pg_settings_name") ?></label>
								    	<input type="text" class="form-control" id="name-in" name="name" placeholder="" value="<?php echo $this->user->info->name ?>">
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="email-in"><?php echo lang("pg_settings_email") ?></label>
								    	<input type="email" class="form-control" id="email-in" name="email" placeholder="" value="<?php echo $this->user->info->email ?>">
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="email-in"><?php echo lang("pg_settings_email_noti") ?></label>
								    	<input type="checkbox" name="email_notification" value="1" <?php if($this->user->info->email_notification) echo "checked" ?> />
								    	<span class="help-block"><?php echo lang("pg_settings_email_noti_ph") ?></span>
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="password-in"><?php echo lang("pg_settings_yourpw") ?></label>
								    	<input type="password" class="form-control" id="password-in" name="password" />
								    </div>
								</div>
						  	</div>

						  	<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_settings_button_update") ?>">

						</div>
					</div>
					<?php echo form_close() ?>
				</div>

			</div>
		</div>
    </div>
</div>