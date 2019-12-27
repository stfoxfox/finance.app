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
					  <li class="active"><?php echo lang("pg_adm_3") ?></li>
					</ol>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_adm_3") ?></div>
						<div class="panel-body">
						  	<table class="table table-bordered">
						  	<tr><td>Total Users: <?php echo number_format($user_count) ?></td><td>Total Staff: <?php echo number_format($staff_count) ?></td><td>Total Tickets Created: <?php echo number_format($ticket_count) ?></td><td>Total Resolved Tickets: <?php echo number_format($ticket_closed_count) ?></td></tr>
						  	<tr><td>Total Ticket Replies: <?php echo number_format($replies_count) ?></td><td>Total Articles: <?php echo number_format($article_count) ?></td><td>Total Agent Actions: <?php echo number_format($agent_count) ?></td><td>Version: <?php echo $this->settings->version ?></td></tr>
						  	</table>
						</div>
					</div>

				</div>

			</div>
		</div>
    </div>
</div>