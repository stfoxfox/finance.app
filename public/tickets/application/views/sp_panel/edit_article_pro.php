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

					<p><?php echo lang("pg_sp_edit_article_text2") ?></p>

					<?php echo form_open(site_url("sp_panel/edit_article_pro_pro/" . $article->ID)) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_sp_edit_article") ?></div>
						<div class="panel-body">
						  	<div class="form-group">
								<div class="row">
									<div class="col-md-12">
									    <label for="email-in"><?php echo lang("pg_sp_article_title") ?></label>
									    <input type="text" class="form-control" id="title-in" name="title" placeholder="" value="<?php echo $article->title ?>">
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-6">
									    <label for="email-in"><?php echo lang("pg_sp_article_cat") ?></label>
									    <select name="catid" class="form-control">
									    <?php 
									    	foreach($categories->result() as $r) {
									    		if($r->ID == $article->catid) {
										    		echo"<option value='{$r->ID}' selected>{$r->name}</option>";
									    		} else {
										    		echo"<option value='{$r->ID}'>{$r->name}</option>";
									    		}
									    	}
									    ?>
									    </select>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="row">
									<div class="col-md-12">
										<textarea name="article_content"><?php echo $article->content ?></textarea>
									</div>
								</div>
							</div>
							<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_sp_update_article") ?>">
						</div>
					</div>
					<?php echo form_close() ?>
					
				</div>

			</div>
		</div>
    </div>
</div>