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
					  <li class="active"><?php echo lang("short_bc_settings") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_settings_text") ?></p>

					<?php echo form_open_multipart(site_url("sp_panel/settings_pro")) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_sp_support_settings") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_site_name") ?></label>
									    <input type="text" class="form-control" id="name-in" name="site_name" placeholder="" value="<?php echo $this->settings->info->site_name ?>">
									    <span class="help-block"><?php echo lang("pg_sp_site_name_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="desc-in"><?php echo lang("pg_sp_site_desc") ?></label>
									    <input type="text" class="form-control" id="desc-in" name="site_desc" placeholder="" value="<?php echo $this->settings->info->site_desc ?>">
									    <span class="help-block"><?php echo lang("pg_sp_site_desc_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="se-in"><?php echo lang("pg_sp_support_email") ?></label>
									    <input type="text" class="form-control" id="se-in" name="support_email" placeholder="" value="<?php echo $this->settings->info->support_email ?>">
									    <span class="help-block"><?php echo lang("pg_sp_support_email_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="image-in"><?php echo lang("pg_sp_site_logo") ?></label>
									    <?php if(!empty($this->settings->info->site_logo)) : ?>
									    	<p><img src='<?php echo base_url().$this->settings->info->upload_path_relative . "/" . $this->settings->info->site_logo ?>'></p>
									    <?php endif; ?>
									    <input type="file" name="userfile" size="20" />
									    <span class="help-block"><?php echo lang("pg_sp_site_logo_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="pname-in"><?php echo lang("pg_sp_upload_path") ?></label>
									    <input type="text" class="form-control" id="pname-in" name="upload_path" placeholder="" value="<?php echo $this->settings->info->upload_path ?>" ><br />
									    <span class="help-block"><?php echo lang("pg_sp_upload_path_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="dpname-in"><?php echo lang("pg_sp_upload_path_rel") ?></label>
									    <input type="text" class="form-control" id="dpname-in" name="upload_path_relative" placeholder="" value="<?php echo $this->settings->info->upload_path_relative ?>" ><br />
									    <span class="help-block"><?php echo lang("pg_sp_upload_path_rel_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="aname-in"><?php echo lang("pg_sp_envato_api_key") ?></label>
									    <input type="text" class="form-control" id="aname-in" name="envato_api_key" placeholder="" value="<?php echo $this->settings->info->envato_api_key ?>" >
									    <span class="help-block"><?php echo lang("pg_sp_envato_api_key_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="bname-in"><?php echo lang("pg_sp_envato_username") ?></label>
									    <input type="text" class="form-control" id="bname-in" name="envato_api_username" placeholder="" value="<?php echo $this->settings->info->envato_api_username ?>" >
									    <span class="help-block"><?php echo lang("pg_sp_envato_username_help") ?></span>
									</div>
								</div>
							</div>

							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="guestname-in"><?php echo lang("pg_sp_guest_tickets") ?></label>
									    <input type="checkbox" id="guestname-in" name="guest_enable" <?php if($this->settings->info->guest_enable) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_sp_gt_help") ?></span>
									</div>
								</div>
							</div>

							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="reg-in"><?php echo lang("pg_sp_register") ?></label>
									    <input type="checkbox" id="reg-in" name="register" <?php if($this->settings->info->register) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_sp_register_help") ?></span>
									</div>
								</div>
							</div>

							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="filename-in"><?php echo lang("pg_sp_enable_file_upload") ?></label>
									    <input type="checkbox" id="filename-in" name="file_enable" <?php if($this->settings->info->file_enable) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_sp_file_upload_help") ?></span>
									</div>
								</div>
							</div>

							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="trname-in"><?php echo lang("pg_sp_enable_ticket_rating") ?></label>
									    <input type="checkbox" id="trname-in" name="ticket_rating" <?php if($this->settings->info->ticket_rating) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_sp_etr_help") ?></span>
									</div>
								</div>
							</div>

							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="trname-in"><?php echo lang("pg_sp_ticket_alert") ?></label>
									    <input type="checkbox" id="trname-in" name="alert_support_staff" <?php if($this->settings->info->alert_support_staff) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_sp_ticket_alert_help") ?></span>
									</div>
								</div>
							</div>

							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="trname-in"><?php echo lang("pg_adm_4") ?></label>
									    <input type="checkbox" id="trname-in" name="disable_captcha" <?php if($this->settings->info->disable_captcha) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_adm_5") ?></span>
									</div>
								</div>
							</div>

							<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_sp_update_settings") ?>">
						</div>
					</div>
					<?php echo form_close() ?>

				</div>

			</div>
		</div>
    </div>
</div>