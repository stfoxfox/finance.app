<div class="col-md-3">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_agent_sb_title") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">
				<p><strong><?php echo lang("pg_agent_sb_head1") ?></strong></p>
				<a href='<?php echo site_url("agent/index/2/") ?>'><?php echo lang("pg_agent_sb_link1") ?></a><br /><br />
				<p><strong><?php echo lang("pg_agent_sb_head2") ?></strong></p>
				<a href='<?php echo site_url("agent/index/1/0") ?>'><?php echo lang("pg_agent_sb_link2") ?></a><br />
				<a href='<?php echo site_url("agent/index/1/1") ?>'><?php echo lang("pg_agent_sb_link3") ?></a><br />
				<a href='<?php echo site_url("agent/index/1/2") ?>'><?php echo lang("pg_agent_sb_link4") ?></a><br /><br />
				<?php if(!$this->user->info->locked_category) : ?>
					<p><strong><?php echo lang("pg_agent_sb_head3") ?></strong></p>
					<a href='<?php echo site_url("agent/index/0/1") ?>'><?php echo lang("pg_agent_sb_link5") ?></a><br />
					<a href='<?php echo site_url("agent/index/0/0") ?>'><?php echo lang("pg_agent_sb_link6") ?></a><br />
					<a href='<?php echo site_url("agent/index/0/2") ?>'><?php echo lang("pg_agent_sb_link7") ?></a><br /><br />
				<?php endif; ?>
				<p><strong><?php echo lang("pg_agent_sb_head4") ?></strong></p>
				<a href='<?php echo site_url("agent/search") ?>'><?php echo lang("pg_agent_sb_link8") ?></a>
				
				</div>
			</div>
		</div>