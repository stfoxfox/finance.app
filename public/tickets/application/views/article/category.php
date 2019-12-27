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
					  <li><a href="<?php echo site_url("article") ?>"><?php echo lang("short_bc_know") ?></a></li>
					  <li class="active"><?php echo $category->name ?></li>
					</ol>


					<div class="panel panel-default">
						<div class="panel-body">
						<?php
							
							foreach($articles->result() as $r) {
								$content = strip_tags($r->content);
                                $content = substr($content, 0, 100);
                                $content = $content . " ...";
                                $artname = $r->title;
                                $artname = trim($artname);
                                $artname = strtolower(str_replace(" ", "-", $artname));
                                $r->name = strtolower(str_replace(" ", "-", $r->name));

                                if($this->settings->info->disable_seo) {
                                	$url = site_url("article/view/" .$r->ID);
                                } else {
                                	$url = site_url("article/view/" .$r->name . "/" . $artname);
                                }
								echo"<div class='col-md-12'><b>{$r->title}</b><br />{$content} ...<br /> <a href='".$url."'>".lang("pg_know_read_link")."</a><hr></div>";
							}
						?>	
						</div>
					</div>

					<div class="align-center decent-margin"><?php echo $this->pagination->create_links(); ?></div>

				</div>

			</div>
		</div>
    </div>
</div>