<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_ticket_your_tickets_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("tickets") ?>"><?php echo lang("short_bc_tickets") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_admin_notes") ?></li>
					</ol>

					<p><?php echo lang("pg_ticket_admin_notes") ?><b><?php echo $ticket->subject ?> (#<?php echo $ticket->ID ?>)</b></p>

					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_ticket_modify_notes") ?></div>
						<div class="panel-body">
							<?php echo form_open(site_url("tickets/notes_pro/" . $ticket->ID)) ?>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									<textarea class="form-control" name="notes" rows="8"><?php echo $ticket->notes ?></textarea>
								    </div>
								</div>
						  	</div>

						  	<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_ticket_update_notes") ?>">
						  	<?php echo form_close() ?>
						</div>
					</div>



				</div>

			</div>
		</div>
    </div>
</div>