<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-article top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_know_heading") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">
					<?php
							        $catname =  $article->name;
							        $catname = trim($catname);
							        $catname = strtolower(str_replace(" ", "-", $catname));
							        if($this->settings->info->disable_seo) {
							        	$url = site_url("article/category/" . $article->ID);
							        } else {
							        	$url = site_url("article/category/" . $catname);
							        }
						?>
					<ol class="breadcrumb">
					  <li><a href="<?php echo '/' ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("tickets") ?>"><?php echo lang("short_bc_tickets") ?></a></li>
					  <li><a href="<?php echo site_url("article") ?>"><?php echo lang("short_bc_know") ?></a></li>
					  <li><a href="<?php echo $url ?>"><?php echo $article->name ?></a></li>
					  <li class="active"><?php echo lang("pg_know_view_article") ?></li>
					</ol>

					<div class="panel panel-default">
						<div class="panel-heading"><h2><?php echo $article->title ?></h2></div>
						<div class="panel-body">
					<p><small><a href='<?php echo $url ?>'><?php echo $article->name ?></a> - <?php echo lang("pg_know_last_updated") ?> <?php echo date("d/m/Y", $article->timestamp) ?></small></p>

					<?php echo $article->content ?>

					<?php if(!$this->settings->info->article_voting) : ?>
						<hr>
						<p><i class="glyphicon glyphicon-thumbs-up"></i> <a href='javascript: void(0)' onclick="vote_article(1, <?php echo $article->ID ?>,'<?php echo $this->security->get_csrf_hash() ?>')"><?php echo lang("pg_know_useful") ?></a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="glyphicon glyphicon-thumbs-down"></i> <a href='javascript: void(0)' onclick="vote_article(0, <?php echo $article->ID ?>,'<?php echo $this->security->get_csrf_hash() ?>')"><?php echo lang("pg_know_not_useful") ?></a></p>
						<div id="article-votes"><p><small><?php echo $article->useful_votes ?>/<?php echo $article->total_votes ?> <?php echo lang("pg_know_found_useful") ?></small></p></div>
					<?php endif; ?>
					</div>
					</div>

				</div>

			</div>
		</div>
    </div>
</div>