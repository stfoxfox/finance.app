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
					  <li class="active"><?php echo lang("short_bc_edit_user") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_edit_user_text") ?></p>

					<?php echo form_open("sp_panel/search_user/", array("class" => "form-inline", "role" => "form")) ?>
					<form class="form-inline" role="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputEmail2"><?php echo lang("pg_sp_edit_user_search") ?></label>
					    <input type="text" class="form-control" name="search_term" id="exampleInputEmail2" placeholder="Enter search term" value="<?php if(isset($search)) echo $search ?>">
					  </div>
					  <div class="form-group">
					    <select name="type" class="form-control"><option value="0" <?php if($type ==0) echo "selected" ?>><?php echo lang("pg_sp_name") ?></option><option value="1" <?php if($type ==1) echo "selected" ?>><?php echo lang("pg_sp_email") ?></option><option value="2" <?php if($type ==2) echo "selected" ?>><?php echo lang("pg_sp_ip") ?></option></select>
					  </div>
					  <button type="submit" class="btn btn-default"><?php echo lang("pg_sp_edit_user_search") ?></button>
					<?php echo form_close() ?>

					<?php echo $this->pagination->create_links(); ?>
					<table width="100%">
						<tr class='table-header'><td class="col-md-2"><b><?php echo lang("pg_sp_name") ?></b></td><td class="col-md-3"><b><?php echo lang("pg_sp_email") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_ip") ?>/<?php echo lang("pg_sp_level") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_manage") ?></b></td></tr>
						<?php
							foreach($users->result() as $r) {
								echo"<tr class='table-row'><td>{$r->name}</td><td>{$r->email}</td><td>{$r->IP}<br />". $this->common->getAccessLevel($r->access_level)."</td><td><a href='".site_url("sp_panel/ban_user/" . $r->ID . "/" . $this->security->get_csrf_hash())."' onclick=\"return confirm('".lang("pg_sp_ban_confirm")."')\">".lang("pg_sp_link_ban")."</a> - <a href='".site_url("sp_panel/edit_user_pro/" . $r->ID . "/") ."'>".lang("pg_sp_link_edit")."</a></td></tr>";
							}
						?>
					</table>
					<?php echo $this->pagination->create_links(); ?>
				</div>

			</div>
		</div>
    </div>
</div>