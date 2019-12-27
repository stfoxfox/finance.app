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
					  <li><a href="#"><?php echo lang("short_bc_home") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_login") ?></li>
					</ol>

					<div class="row">
						<div class="col-md-8 col-md-offset-2">
							<div class="panel panel-default">
								<div class="panel-heading"><?php echo lang("pg_login_welcome") ?></div>
								<div class="panel-body">
									<?php echo form_open(site_url("login/pro")) ?>
									<p class="sans-big-text"><?php echo lang("pg_login_email") ?></p>
	                    			<div class="input-group">
	                      				<span class="input-group-addon">@</span>
	                      				<input type="text" name="email" class="form-control">
	                    			</div><br />

	                    			<p class="sans-big-text"><?php echo lang("pg_login_password") ?></p>
	                    			<div class="input-group">
	                      				<span class="input-group-addon"><span class="glyphicon glyphicon-hand-right"></span></span>
	                      				<input type="password" name="pass" class="form-control">
	                    			</div><br />

	                    			<input type="checkbox" class="" name="remember" value="1"> <?php echo lang("pg_login_remember") ?>
	                    			<input type="submit" class="btn btn-primary floatRight purpleButton" value="<?php echo lang("pg_login_button") ?>">
	                    			<?php echo form_close() ?>
                    			</div>
                    		</div>
                    		<a href="<?php echo site_url("login/forgotpw") ?>"><?php echo lang("pg_login_forgotpw_header") ?></a>
                    	</div>
                    </div>

				</div>
			</div>
		</div>
	</div>
</div>