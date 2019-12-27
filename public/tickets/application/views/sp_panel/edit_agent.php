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
					  <li class="active"><?php echo lang("short_bc_edit_agent") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_edit_agent_help") ?></p>

					<table width="100%">
						<tr class='table-header'><td class="col-md-2"><b><?php echo lang("pg_sp_agent_name") ?></b></td><td class="col-md-3"><b><?php echo lang("pg_sp_agent_email") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_access_level") ?>/<?php echo lang("pg_sp_tickets") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_manage") ?></b></td></tr>
						<?php
							foreach($agents->result() as $r) {
								echo"<tr class='table-row'><td>{$r->name}</td><td>{$r->email}</td><td>". $this->common->getAccessLevel($r->access_level)." / {$r->ticket_responses}</td><td><a href='".site_url("sp_panel/deactivate_agent/" . $r->ID . "/" . $this->security->get_csrf_hash())."' onclick=\"return confirm('".lang("pg_sp_confirm_deactive")."')\">".lang("pg_sp_link_deactivate")."</a> - <a href='".site_url("sp_panel/edit_agent_pro/" . $r->ID . "/") ."'>".lang("pg_sp_link_edit")."</a> - <a href='".site_url("sp_panel/agent_log/" . $r->ID)."'>".lang("pg_sp_log")."</a></td></tr>";
							}
						?>
					</table>
				</div>

			</div>
		</div>
    </div>
</div>