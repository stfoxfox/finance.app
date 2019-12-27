<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_ticket_anon_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("tickets") ?>"><?php echo lang("short_bc_tickets") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_anon_tickets") ?></li>
					</ol>

				<p><img src="<?php echo base_url() ?>images/icons/gear_48.png" class="floatLeft right-margin" alt="content" /><?php echo lang("pg_ticket_anon_welcome") ?></p>
				<p><?php echo lang("pg_ticket_anon_view") ?></p>
				<br />
				<div class="row">
					<div class="col-md-8 col-md-offset-2">
						<div class="panel panel-default">
							<div class="panel-heading"><?php echo lang("pg_ticket_anon_req") ?></div>
							<div class="panel-body">
								<?php echo form_open(site_url("tickets/anon_pro")) ?>
								<p class="sans-big-text"><?php echo lang("pg_ticket_email") ?></p>
		                		<div class="input-group">
		                  			<span class="input-group-addon">@</span>
		                  			<input type="text" name="email" class="form-control">
		                  		</div>
		                  		<br />

				                <p class="sans-big-text"><?php echo lang("pg_ticket_ticketid") ?></p>
		                		<div class="input-group">
		                  			<span class="input-group-addon">#</span>
		                  			<input type="text" name="ticketid" class="form-control">
				                </div><br />

				                <p class="sans-big-text"><?php echo lang("pg_ticket_ticketpw") ?></p>
		                		<div class="input-group">
		                  			<span class="input-group-addon"><span class="glyphicon glyphicon-hand-right"></span></span>
		                  			<input type="password" name="pass" class="form-control">
		                  		</div>
				                <br />

				                <input type="submit" class="btn btn-primary floatLeft purpleButton" value="<?php echo lang("pg_ticket_button_access") ?>">
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