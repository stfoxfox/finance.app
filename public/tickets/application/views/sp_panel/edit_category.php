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
					  <li class="active"><?php echo lang("short_bc_edit_article_cat") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_edit_article_cats") ?></p>

					<table width="100%">
						<tr class='table-header'><td class="col-md-2"><b><?php echo lang("pg_sp_category_name") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_edit_options") ?></b></td></tr>
						<?php
							foreach($categories->result() as $r) {
								echo"<tr class='table-row'><td>{$r->name}</td><td><a href='".site_url("sp_panel/delete_category/" . $r->ID . "/" . $this->security->get_csrf_hash())."' onclick=\"return confirm('".lang("pg_sp_delete_confirm_cat")."')\">".lang("pg_sp_link_delete")."</a> - <a href='".site_url("sp_panel/edit_category_pro/" . $r->ID . "/") ."'>".lang("pg_sp_link_edit")."</a></td></tr>";
							}
						?>
					</table>
				</div>

			</div>
		</div>
    </div>
</div>