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
					  <li class="active"><?php echo lang("short_bc_custo_css") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_css_help") ?></p>

					<?php echo form_open(site_url("sp_panel/custom_css_pro/")) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_sp_custom_css") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
								<div class="row">
									<div class="col-md-12">
									    <label for="title-in">CSS</label>
									    <textarea class="form-control" id="title-in" name="css" /><?php echo $this->settings->info->custom_css ?></textarea>
									</div>
								</div>
							</div>
							<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_sp_custom_css_button") ?>">
						</div>
					</div>
					<?php echo form_close() ?>
					
				</div>

			</div>
		</div>
    </div>
</div>