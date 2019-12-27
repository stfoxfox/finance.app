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
					  <li class="active"><?php echo lang("short_bc_ip_block") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_ip_block_text") ?></p>

					<h4><?php echo lang("pg_sp_block_ip") ?></h4>
					<?php echo form_open("sp_panel/block_ip/", array("class" => "form-inline", "role" => "form")) ?>
					<form class="form-inline" role="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputEmail2"><?php echo lang("pg_sp_ip_label") ?></label>
					    <input type="text" class="form-control" name="ip" id="exampleInputEmail2" placeholder="<?php echo lang("pg_sp_ip_label_ph") ?>">
					  </div>
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputEmail1"><?php echo lang("pg_sp_reason_label") ?></label>
					    <input type="text" class="form-control" name="reason" id="exampleInputEmail1" placeholder="Note">
					  </div>
					  <button type="submit" class="btn btn-default"><?php echo lang("pg_sp_block_ip_button") ?></button>
					<?php echo form_close() ?>

					<?php echo $this->pagination->create_links(); ?>
					<table width="100%">
						<tr class='table-header'><td class="col-md-2"><b><?php echo lang("pg_sp_ip_label") ?></b></td><td class="col-md-3"><b><?php echo lang("pg_sp_reason_label") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_timestamp") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_manage") ?></b></td></tr>
						<?php
							foreach($ips->result() as $r) {
								echo"<tr class='table-row'><td>{$r->IP}</td><td>{$r->reason}</td><td>".date("m-d-Y", $r->timestamp)."</td><td><a href='".site_url("sp_panel/delete_ip/" . $r->ID . "/" . $this->security->get_csrf_hash())."'>".lang("pg_sp_link_delete")."</a></td></tr>";
							}
						?>
					</table>
					<?php echo $this->pagination->create_links(); ?>
				</div>

			</div>
		</div>
    </div>
</div>