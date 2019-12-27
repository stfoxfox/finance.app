<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-article top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_know_heading") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo '/' ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("tickets") ?>"><?php echo lang("short_bc_tickets") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_know") ?></li>
					</ol>

					<div><img src="<?php echo base_url() ?>images/icons/document_64.png" class="floatLeft right-margin" alt="content" /> <?php echo lang("pg_know_welcome") ?>
					</div>
					<br /><br /><br />
					<div class="panel panel-default">
						<div class="panel-body">
							<div class='row'>
							<?php 
								foreach($categories->result() as $r) {
							        $catname =  $r->name;
							        $catname = trim($catname);
							        $catname = strtolower(str_replace(" ", "-", $catname));
							        if($this->settings->info->disable_seo) {
							        	$url = site_url("article/category/" . $r->ID);
							        } else {
							        	$url = site_url("article/category/" . $catname);
							        }
									echo"<div class='col-md-6 margin-bottom'><i class='glyphicon glyphicon-folder-open margin-right'></i> <a href='".$url."'>{$r->name}</a> ({$r->article_count})<br /><span class='sub-text'>{$r->article_desc}</span></div>";
								}
							?>
							</div>
						</div>
					</div>

				</div>

			</div>
		</div>
    </div>
</div>