<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_ticket_your_tickets_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("tickets") ?>"><?php echo lang("short_bc_tickets") ?></a></li>
					  <li class="active"><?php echo lang("pg_ctn_3") ?></li>
					</ol>


					<p><b><?php echo $ticket->subject ?> (#<a href="<?php echo site_url("tickets/view/" . $ticket->ID) ?>"><?php echo $ticket->ID ?></a>)</b></p>
					<p><?php echo lang("pg_ctn_4") ?></p>

					<p><?php echo lang("pg_ctn_5") ?></p>

					<div class="panel panel-default">
						<div class="panel-body">
						<b><?php echo lang("pg_ctn_11") ?></b><br /><br />
						<?php echo form_open(site_url("tickets/assign_ticket/" . $ticket->ID)) ?>
						<div class="row">
							<div class="col-md-4">
						<select name="userid" class="form-control">
							<?php foreach($staff->result() as $r) : ?>
								<option value="<?php echo $r->ID ?>"><?php echo $r->email ?> - <?php echo $r->name ?></option>
							<?php endforeach; ?>
						</select>
						</div>
						<div class="col-md-6"> <input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_ctn_12") ?>" /></div>
						</div>
						<?php echo form_close() ?>
						</div>
					</div>

					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_ctn_3") ?></div>
						<div class="panel-body">
							<b><?php echo lang("pg_ctn_6") ?></b><br />
							<table class="table table-bordered">
								<tr><td><?php echo lang("pg_ctn_7") ?></td><td><?php echo lang("pg_ctn_8") ?></td><td><?php echo lang("pg_ctn_9") ?></td></tr>
							<?php foreach($users as $user) : ?>
								<tr><td><?php echo $user->name ?></td><td><?php echo $user->email ?></td><td><a href="<?php echo site_url("tickets/remove_assign/" . $ticket->ID . "/" . $user->ID . "/" . $this->security->get_csrf_hash()) ?>"><?php echo lang("pg_ctn_10") ?></a></td></tr>
							<?php endforeach; ?>
							</table>
						</div>
					</div>



				</div>

			</div>
		</div>
    </div>
</div>