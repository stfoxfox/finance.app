<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_register_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo base_url() ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("tickets") ?>"><?php echo lang("short_bc_tickets") ?></a></li>
					  <li><a href="<?php echo site_url("tickets/your") ?>"><?php echo lang("short_bc_your_tickets") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_edit_ticket") ?></li>
					</ol>

					<p>Below you can modify your ticket.</p>

					<?php echo form_open(site_url("tickets/edit_ticket_pro/" . $ticket->ID)) ?>

					<textarea name="ticket_reply" class="form-control" rows="8"><?php echo $ticket->message ?></textarea>

					<br /><br />

					<p><input type="submit" name="s" value="Update Ticket" class="btn btn-primary" /></p>

					<?php echo form_close() ?>

				</div>

			</div>
		</div>
    </div>
</div>		