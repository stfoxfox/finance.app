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
					  <li class="active"><?php echo lang("short_bc_your_tickets") ?></li>
					</ol>

					<table width="100%">
						<tr class='table-header'><td class="col-md-6"><b><?php echo lang("pg_ticket_view_subject") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_ticket_category") ?></b></td><td class="col-md-1"><b><?php echo lang("pg_ticket_status") ?></b></td><td class="col-md-3"><b><?php echo lang("pg_ticket_view_lr") ?></b></td></tr>
						<?php
						$c=0;
							foreach($tickets->result() as $r) {
								if($r->status==0) {
									$statusmsg = "<span class='open-ticket'>".lang("ticket_status_open")."</span>";
								} elseif($r->status == 1) {
									$statusmsg = "<span class='response-ticket'>".lang("ticket_status_awaiting")."</span>";
								} elseif($r->status == 2) {
									$statusmsg = "<span class='closed-ticket'>".lang("ticket_status_closed")."</span>";
								} else {
									$statusmsg = lang("ticket_status_invalid");
								}
								if(empty($r->replyname)) $r->replyname = lang("pg_ticket_view_you");
								$datetime = date("m/d/Y H:i",$r->last_reply_timestamp);
								if($c==0){
									$cl="table-row-no";
									$c++;
								} else {
									$cl="table-row-other";
									$c=0;
								}
								echo"<tr class='table-row $cl'><td><a href='".site_url("tickets/view/" . $r->ID)."'>{$r->subject}</a></td><td>{$r->catname}</td><td>{$statusmsg}</td><td>{$r->replyname} ($r->replies)<br />$datetime</td></tr>";
							}
						?>
					</table>

					<?php if($tickets->num_rows() == 0) : ?>
						<div class="align-center decent-margin"><?php echo lang("pg_ticket_view_no_tickets") ?></div>
					<?php endif; ?>

				</div>

			</div>
		</div>
    </div>
</div>