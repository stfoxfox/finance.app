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
					  <li class="active"><?php echo lang("short_bc_knowledge") ?></li>
					</ol>

					<p><?php echo lang("pg_sp_knowledge_help") ?></p>
					<?php echo form_open(site_url("sp_panel/knowledge_update/")) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_sp_knowledge") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="filename-in"><?php echo lang("pg_sp_disable_av") ?></label>
									    <input type="checkbox" id="filename-in" name="article_voting" <?php if($this->settings->info->article_voting) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_sp_disable_av_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="kbname-in"><?php echo lang("pg_sp_kb_login") ?></label>
									    <input type="checkbox" id="kbname-in" name="kb_login" <?php if($this->settings->info->kb_login) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_sp_kb_login_help") ?></span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-9">
									    <label for="kbname-in"><?php echo lang("pg_adm_6") ?></label>
									    <input type="checkbox" id="kbname-in" name="disable_seo" <?php if($this->settings->info->disable_seo) echo "checked" ?> value="1" />
									    <span class="help-block"><?php echo lang("pg_adm_7") ?></span>
									</div>
								</div>
							</div>
							<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_sp_update_settings") ?>">
						</div>
					</div>
					<?php echo form_close() ?>

				</div>

			</div>
		</div>
    </div>
</div>