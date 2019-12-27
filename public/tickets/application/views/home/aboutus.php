<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_about_title") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_about") ?></li>
					</ol>

					<p class="bot-margin"><img src="<?php echo base_url() ?>images/icons/home_64_grey.png" class="floatLeft right-margin" alt="content" />
					<?php echo lang("pg_about_main") ?>
					</p>

					<div class="align-center">
					<h3><?php echo lang("pg_about_heading") ?></h3>

					<?php 

						foreach($agents->result() as $r) {
							if($r->bio_pic) {
								$image = $this->settings->info->upload_path_relative . "/" . $r->bio_pic;
							} else {
								$image = "images/icons/man_64.png";
							}
							echo"<div class='about-us-person'><img src='".base_url().$image."' width='200' height='200' alt='staff'><br />{$r->name}<br /><i>".$this->common->getAccessLevel($r->access_level)."</i></div>";
						}

					?>

					</div>
					
				</div>
			</div>
		</div>
    </div>
</div>