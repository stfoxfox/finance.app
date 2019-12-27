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
					  <li class="active"><?php echo lang("short_bc_view_ratings") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_view_rating") ?></p>

					<table width="100%">
						<tr class='table-header'><td class="col-md-2"><b><?php echo lang("pg_sp_ticket") ?></b></td><td class="col-md-3"><b><?php echo lang("pg_sp_rating") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_edit_options") ?></b></td></tr>
						<?php
							foreach($ratings->result() as $r) {
								if($r->rating == 1) {
									$ratingMessage = lang("pg_ticket_view_rate1");
								} elseif($r->rating == 2) {
									$ratingMessage = lang("pg_ticket_view_rate2");
								} elseif($r->rating == 3) {
									$ratingMessage = lang("pg_ticket_view_rate3");
								} elseif($r->rating == 4) {
									$ratingMessage = lang("pg_ticket_view_rate4");
								} elseif($r->rating == 5) {
									$ratingMessage = lang("pg_ticket_view_rate5");
								}
								echo"<tr class='table-row'><td>{$r->subject}</td><td>{$ratingMessage}</td><td><a href='".site_url("tickets/view/" . $r->ticketid)."'>".lang("pg_sp_view_ticket")."</a></td></tr>";
							}
						?>
					</table>
					<?php echo $this->pagination->create_links(); ?>
				</div>

			</div>
		</div>
    </div>
</div>