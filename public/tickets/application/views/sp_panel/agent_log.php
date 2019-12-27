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
					  <li class="active"><?php echo lang("short_bc_agent_log") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_agent_text") ?></p>

					<table width="100%">
						<tr class='table-header'><td class="col-md-2"><b><?php echo lang("pg_sp_agent") ?></b></td><td class="col-md-4"><b><?php echo lang("pg_sp_log") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_ip") ?>/<?php echo lang("pg_sp_timestamp") ?></b></td></tr>
						<?php
							foreach($logs->result() as $r) {
								if($r->ticketid) {
									$ticketmsg = "<br /><a href='".site_url("tickets/view/" . $r->ticketid)."'>".lang("pg_sp_view_ticket")."</a>";
								}
								echo"<tr class='table-row'><td>{$r->email}<br />{$r->name}</td><td>{$r->message}{$ticketmsg}</td><td>{$r->IP}<br />".date("m-d-Y h:i:s", $r->timestamp)."</td></td></tr>";
							}
						?>
					</table>


					<?php echo $this->pagination->create_links(); ?>

				</div>

			</div>
		</div>
    </div>
</div>