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
					  <li class="active"><?php echo lang("short_bc_ecanned") ?></li>
					</ol>

					<p><?php echo lang("pg_canned_s3") ?></p>

					<table class="table table-bordered">
						<tr><td>Title</td><td><?php echo lang("pg_sp_manage") ?></td></tr>
						<?php foreach($responses->result() as $r) : ?>
							<tr><td><?php echo $r->title ?></td><td><a href="<?php echo site_url("sp_panel/edit_canned_response_pro/" . $r->ID) ?>"><?php echo lang("pg_sp_link_edit") ?></a> - <a href="<?php echo site_url("sp_panel/delete_canned_response/" . $r->ID . "/" . $this->security->get_csrf_hash()) ?>"><?php echo lang("pg_sp_link_delete") ?></a></td></tr>
						<?php endforeach; ?>
					</table>
					
				</div>

			</div>
		</div>
    </div>
</div>