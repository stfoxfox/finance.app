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
					  <li class="active"><?php echo lang("short_bc_edit_custom_field") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_edit_custom_field_text") ?></p>
					<table class="table table-bordered">
						<tr class="table-header-small"><td><?php echo lang("pg_sp_field_name") ?></td><td><?php echo lang("pg_sp_field_type") ?></td><td><?php echo lang("pg_sp_edit_options") ?></td></tr>
						
						<?php
							foreach($fields->result() as $r) {
								if($r->type == 0) {
									$r->type = lang("pg_sp_field_type_option1");
								} elseif($r->type == 1) {
									$r->type = lang("pg_sp_field_type_option2");
								} elseif($r->type == 2) {
									$r->type = lang("pg_sp_field_type_option3");
								} elseif($r->type == 3) {
									$r->type = lang("pg_sp_field_type_option4");
								} elseif($r->type == 4) {
									$r->type = lang("pg_sp_field_type_option5");
								}
								echo"<tr class='table-row'><td>{$r->name}</td><td>{$r->type}</td><td><a href='".site_url("sp_panel/edit_custom_field/" . $r->ID)."'>".lang("pg_sp_link_edit")."</a> - <a href='".site_url("sp_panel/edit_custom_field_delete/" . $r->ID)."'>".lang("pg_sp_link_delete")."</a></td></tr>";
							}

						?>
					</table>


				</div>

			</div>
		</div>
    </div>
</div>