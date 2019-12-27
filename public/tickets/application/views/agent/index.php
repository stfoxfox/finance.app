<div class="container marginTop">
	<div class="row">
		<?php include("sidebar.php"); ?>
        <div class="col-md-9">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_agent_title") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("sp_panel") ?>"><?php echo lang("short_bc_admin") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_viewtickets") ?></li>
					</ol>

					<p>

					<?php if($type == 2 && $status == 0) : ?>
						
					<div class="btn-group">
						<?php if($catid ==0) : ?>
							<p><a class="btn btn-default" href="<?php echo site_url("agent/index/". $type . "/" . $status . "/" . "0" . "/" . $toggle_porder . "/" . "0" . "/")?>"><b><?php echo lang("pg_agent_all_categories") ?></b></a>
						<?php else: ?>
							<p><a class="btn btn-default" href="<?php echo site_url("agent/index/". $type . "/" . $status . "/" . "0" . "/" . $toggle_porder . "/" . "0" . "/")?>"><?php echo lang("pg_agent_all_categories") ?></a>
						<?php endif; ?>
						<?php foreach($categories->result() as $r) : ?>
							<?php if($r->ID == $catid) : ?>
								<a class="btn btn-default" href="<?php echo site_url("agent/index/". $type . "/" . $status . "/" . "0" . "/" . $toggle_porder . "/" . $r->ID . "/")?>"><b><?php echo $r->name ?></b></a>
							<?php else : ?>
								<?php if(!$this->user->info->locked_category) : ?>
									<a class="btn btn-default" href="<?php echo site_url("agent/index/". $type . "/" . $status . "/" . "0" . "/" . $toggle_porder . "/" . $r->ID . "/")?>"><?php echo $r->name ?></a>
								<?php endif; ?>
							<?php endif; ?>
						<?php endforeach; ?></div></p>
						<?php echo lang("pg_agent_view_tickets_text1") ?>
					<?php endif; ?>
					<?php if($type == 0 && $status == 0) : ?>
						<?php echo lang("pg_agent_view_tickets_text2") ?>
					<?php endif; ?>
					<?php if($type == 0 && $status == 2) : ?>
						<?php echo lang("pg_agent_view_tickets_text3") ?>
					<?php endif; ?>
					<?php if($type == 0 && $status == 1) : ?>
						<?php echo lang("pg_agent_view_tickets_text4") ?>
					<?php endif; ?>
					<?php if($type == 1 && $status == 0) : ?>
						<?php echo lang("pg_agent_view_tickets_text5") ?>
					<?php endif; ?>
					<?php if($type == 1 && $status == 1) : ?>
						<?php echo lang("pg_agent_view_tickets_text6") ?>
					<?php endif; ?>
					<?php if($type == 1 && $status == 2) : ?>
						<?php echo lang("pg_agent_view_tickets_text7") ?>
					<?php endif; ?>
					<?php if($toggle_order == 0 && $toggle_porder ==0) : ?>
						<?php echo lang("pg_agent_order_text1") ?>
					<?php elseif($toggle_order == 1 && $toggle_porder ==0) : ?>
						<?php echo lang("pg_agent_order_text2") ?>
					<?php endif; ?>
					<?php if($toggle_porder ==1) : ?>
						<?php echo lang("pg_agent_order_text3") ?>
					<?php elseif($toggle_porder ==2) : ?>
						<?php echo lang("pg_agent_order_text4") ?>
					<?php endif; ?>
					<?php if($toggle_porder == 0) $toggle_porder=2; ?>
					</p>

					<table width="100%">
						<tr class='table-header-small'><td class="col-md-5"><b><?php echo lang("pg_agent_header_subject") ?></b></td><td class="col-md-1"><b><?php echo lang("pg_agent_header_priority") ?></b> <a href='<?php echo site_url("agent/index/". $type . "/" . $status . "/" . "0" . "/" . $toggle_porder . "/" . $catid . "/")?>'><span class='glyphicon <?php echo $picon_type ?>'></span></a></td><td class="col-md-2"><b><?php echo lang("pg_agent_header_category") ?></b></td><td class="col-md-1"><b><?php echo lang("pg_agent_header_status") ?></b></td><td class="col-md-3"><b><?php echo lang("pg_agent_header_lastreply") ?></b> <a href='<?php echo site_url("agent/index/". $type . "/" . $status . "/" . $toggle_order . "/" . "0" . "/" . $catid . "/")?>'><span class='glyphicon <?php echo $icon_type ?>'></span></a></td></tr>
						<?php
						$c=0;
							foreach($tickets->result() as $r) {
								if($r->status==0) {
									$statusmsg = "<span class='response-ticket'>".lang("ticket_status_awaiting")."</span>";
								} elseif($r->status == 1) {
									$statusmsg = "<span class='open-ticket'>".lang("ticket_status_responded")."</span>";
								} elseif($r->status == 2) {
									$statusmsg = "<span class='closed-ticket'>".lang("ticket_status_closed")."</span>";
								} else {
									$statusmsg = land("ticket_status_invalid");
								}

								if($r->priority == 0) {
							    	$priority = "<span class='priority-low'>".lang("ticket_priority_low")."</span>";
							    } elseif($r->priority == 1) {
							    	$priority = "<span class='priority-medium'>".lang("ticket_priority_medium")."</span>";
							    } elseif($r->priority == 2) {
							    	$priority = "<span class='priority-high'>".lang("ticket_priority_high")."</span>";
							    } elseif($r->priority == 3) {
							    	$priority = "<span class='priority-urgent'>".lang("ticket_priority_urgent")."</span>";
							    }

								if(empty($r->replyname)) $r->replyname = lang("ticket_creator");
								$datetime = date("m/d/Y H:i",$r->last_reply_timestamp);
								if($c==0){
									$cl="table-row-no";
									$c++;
								} else {
									$cl="table-row-other";
									$c=0;
								}
								echo"<tr class='table-row $cl'><td>(#{$r->ID}) - <a href='".site_url("tickets/view/" . $r->ID)."'>{$r->subject}</a><br />By {$r->name}</td><td>{$priority}</td><td>{$r->catname}</td><td>{$statusmsg}</td><td>{$r->replyname} ($r->replies)<br />$datetime</td></tr>";
							}
						?>
					</table>
					<?php echo $this->pagination->create_links(); ?>
				</div>

			</div>
		</div>
    </div>
</div>