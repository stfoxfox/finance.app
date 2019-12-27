<div class="container marginTop">
	<div class="row">
		<?php include("sidebar.php"); ?>
        <div class="col-md-9">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png"></div><div class="page-header-title"><?php echo lang("pg_sp_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("sp_admin") ?>"><?php echo lang("short_bc_admin") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_edit_article") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_edit_article_text") ?></p>

					<p><div class="btn-group">
					  <button type="button" class="btn btn-primary"><?php echo lang("pg_edit_article_text3") ?></button>
					  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
					    <span class="caret"></span>
					    <span class="sr-only">Toggle Dropdown</span>
					  </button>
					  <ul class="dropdown-menu" role="menu">
					   <?php foreach($categories->result() as $r) : ?>
					   	<li><a href="<?php echo site_url("sp_panel/edit_article/" . $r->ID) ?>"><?php echo $r->name ?></a></li>
					   <?php endforeach; ?>
					  </ul>
					</div></p>

					<table width="100%">
						<tr class='table-header'><td class="col-md-2"><b><?php echo lang("pg_sp_article_title") ?></b></td><td class="col-md-3"><b><?php echo lang("pg_sp_article_cat") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_sp_edit_options") ?></b></td></tr>
						<?php
							foreach($articles->result() as $r) {
								echo"<tr class='table-row'><td>{$r->title}</td><td>{$r->name}</td><td><a href='".site_url("sp_panel/delete_article/" . $r->ID . "/" . $this->security->get_csrf_hash())."' onclick=\"return confirm('".lang("pg_sp_delete_confirm")."')\">".lang("pg_sp_link_delete")."</a> - <a href='".site_url("sp_panel/edit_article_pro/" . $r->ID . "/") ."'>".lang("pg_sp_link_edit")."</a></td></tr>";
							}
						?>
					</table>
					<?php echo $this->pagination->create_links(); ?>
				</div>

			</div>
		</div>
    </div>
</div>