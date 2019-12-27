<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_login_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo base_url() ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("login") ?>"><?php echo lang("short_bc_login") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_forgotpw") ?></li>
					</ol>

					<p><?php echo lang("pg_login_forgotpw") ?></p>

					<p><?php echo lang("pg_login_note") ?></p>

					<div class="row">
						<div class="col-md-8 col-md-offset-2">
							<div class="panel panel-default">
								<div class="panel-heading"><?php echo lang("pg_login_forgotpw_header") ?></div>
								<div class="panel-body">
									<?php echo form_open(site_url("login/forgotpw_pro/")) ?>
									<p class="sans-big-text"><?php echo lang("pg_login_email") ?></p>
	                    			<div class="input-group">
	                      				<span class="input-group-addon">@</span>
	                      				<input type="text" name="email" class="form-control">
	                    			</div><br />
	                    			<input type="submit" class="btn btn-primary purpleButton" value="<?php echo lang("pg_login_button_reset") ?>">
	                    			<?php echo form_close() ?>
                    			</div>
                    		</div>
                    	</div>
                    </div>

				</div>
			</div>
		</div>
	</div>
</div>