<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_ticket_hader") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_tickets") ?></li>
					</ol>

					<div class="row">
						<div class="col-md-6">
							<div class="ticket-icon">
								<img src="<?php echo base_url() ?>images/icons/gear_64.png" alt="ticket">
							</div>
							<div class="ticket-area-info">
								<h4><a href='<?php echo site_url("tickets/create") ?>'><?php echo lang("pg_ticket_create_link") ?></a></h4>
								<p><?php echo lang("pg_ticket_create_info") ?></p>
							</div>
							<div class='clearfix'></div>
						</div>
						<div class="col-md-6">
							<div class="ticket-icon">
								<img src="<?php echo base_url() ?>images/icons/man_64.png" alt="your tickets">
							</div>
							<div class="ticket-area-info">
								<h4><a href='<?php echo site_url("tickets/your") ?>'><?php echo lang("pg_ticket_tickets_link") ?></a></h4>
								<p><?php echo lang("pg_ticket_tickets_info") ?></p>
							</div>
							<div class='clearfix'></div>
						</div>
					</div>
					<br /><br />
					<div class="row">
						<div class="col-md-6">
							<div class="ticket-icon">
								<img src="<?php echo base_url() ?>images/icons/document_64.png" alt="Knowledge Base">
							</div>
							<div class="ticket-area-info">
								<h4><a href='<?php echo site_url("article") ?>'><?php echo lang("pg_ticket_know_link") ?></a></h4>
								<p><?php echo lang("pg_ticket_know_info") ?></p>
							</div>
							<div class='clearfix'></div>
						</div>
						<div class="col-md-6">
							<div class="ticket-icon">
								<img src="<?php echo base_url() ?>images/icons/disk_64.png" alt="Old Tickets">
							</div>
							<div class="ticket-area-info">
								<h4><a href='<?php echo site_url("tickets/old") ?>'><?php echo lang("pg_ticket_old_link") ?></a></h4>
								<p><?php echo lang("pg_ticket_old_info") ?></p>
							</div>
							<div class='clearfix'></div>
						</div>
					</div>

				</div>

			</div>
		</div>
    </div>
</div>