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
					  <li class="active"><?php echo lang("short_bc_twitter_settings") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_twitter_help") ?></p>
					<?php echo form_open(site_url("sp_panel/twitter_update/")) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_sp_twitter_settings") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_twitter_account") ?></label>
									    <input type="text" class="form-control" id="name-in" name="twitter_name" placeholder="" value="<?php echo $this->settings->info->twitter_name ?>">
									    <span class="help-block"><?php echo lang("pg_sp_twitter_account_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_adm_1") ?></label>
									    <input type="text" class="form-control" id="name-in" name="update_tweets" placeholder="" value="<?php echo $this->settings->info->update_tweets ?>">
									    <span class="help-block"><?php echo lang("pg_adm_2") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_tweets_display") ?></label>
									    <input type="text" class="form-control" id="name-in" name="twitter_display_limit" placeholder="" value="<?php echo $this->settings->info->twitter_display_limit ?>">
									    <span class="help-block"><?php echo lang("pg_sp_td_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_twitter_ck") ?></label>
									    <input type="text" class="form-control" id="name-in" name="twitter_consumer_key" placeholder="" value="<?php echo $this->settings->info->twitter_consumer_key ?>">
									    <span class="help-block"><?php echo lang("pg_sp_twitter_ck_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_twitter_cs") ?></label>
									    <input type="text" class="form-control" id="name-in" name="twitter_consumer_secret" placeholder="" value="<?php echo $this->settings->info->twitter_consumer_secret ?>">
									    <span class="help-block"><?php echo lang("pg_sp_twitter_cs_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_twitter_at") ?></label>
									    <input type="text" class="form-control" id="name-in" name="twitter_access_token" placeholder="" value="<?php echo $this->settings->info->twitter_access_token ?>">
									    <span class="help-block"><?php echo lang("pg_sp_twitter_at_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="name-in"><?php echo lang("pg_sp_twitter_as") ?></label>
									    <input type="text" class="form-control" id="name-in" name="twitter_access_secret" placeholder="" value="<?php echo $this->settings->info->twitter_access_secret ?>">
									    <span class="help-block"><?php echo lang("pg_sp_twitter_as_help") ?></span>
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