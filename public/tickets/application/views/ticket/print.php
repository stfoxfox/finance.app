<link href="<?php echo base_url();?>bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
<div class="container">
	<div class="row">
		<div class="col-md-12">
<div class="panel panel-primary">
	<div class="panel-heading"><?php echo lang("pg_ticket_view_ticketinfo") ?></div>
	  <div class="panel-body">
		  <div class="row">
		  	<div class="col-md-4">
			    <?php echo lang("pg_ticket_view_subject") ?>: <b><?php echo $ticket->subject ?></b><br />
			    <?php echo lang("pg_ticket_email") ?>: <?php echo $ticket->email ?><br />
			    <?php echo lang("pg_ticket_view_created") ?>: <?php echo date("m/d/Y H:i",$ticket->timestamp); ?><br />
			    <?php echo lang("pg_ticket_priority") ?>: <b><?php if($ticket->priority == 0) {
			    	echo lang("ticket_priority_low");
			    } elseif($ticket->priority == 1) {
			    	echo lang("ticket_priority_medium");
			    } elseif($ticket->priority == 2) {
			    	echo lang("ticket_priority_high");
			    } elseif($ticket->priority == 3) {
			    	echo lang("ticket_priority_urgent");
			    }

			    ?></b>
			</div>
			<div class="col-md-4">
			<?php echo lang("pg_ticket_view_lr") ?>: <?php echo date("m/d/Y H:i",$ticket->last_reply_timestamp); ?><br />
			<?php echo lang("pg_ticket_view_by") ?>: <?php echo $ticket->replyname ?><br />
			<?php echo lang("pg_ticket_category") ?>: <?php echo $ticket->catname ?><br />
			<?php echo lang("pg_ticket_view_ip") ?>: <?php echo $ticket->IP ?>
			</div>
			<div class="col-md-4 align-right">
				<!-- Split button -->

			</div>
	    </div>
	    <?php if(!empty($ticket->custom_fields)) : ?>
	    <div class="row">
		    <div class="col-md-12">
		    <hr class="hr">
		    	<?php
		    		$fields = explode("|1***1|", $ticket->custom_fields);
		    		foreach($fields as $field) {
		    			$field = explode("|0***0|", $field);
		    			echo "{$field[0]}: {$field[1]}<br />";
		    		}
		    	?>
		    </div>
	    </div>
		<?php endif; ?>
	  </div>
</div>

<?php if($this->user->loggedin && $this->user->info->access_level > 0) :?>
	<?php if(!empty($ticket->notes)) : ?>
	<div id="anotes">
		<div class='panel panel-danger'>
			<div class='panel-heading align-left' data-toggle='collapse' data-target='#admin-notes'><strong><?php echo lang("short_bc_admin_notes") ?></strong></div>
				<div class='panel-body collapse in' id='admin-notes'>
				<?php if(empty($ticket->notes)) : ?>
					<p><?php echo lang("pg_ticket_no_notes") ?></p>
				<?php else: ?>
					<?php echo nl2br($ticket->notes) ?>
				<?php endif; ?><br /><br />
				<a href='<?php echo site_url("tickets/notes/" . $ticket->ID) ?>'><?php echo lang("pg_ticket_edit_link") ?></a>
				</div>
		</div>
	</div>
<?php endif; ?>
<?php endif; ?>

<?php
$count =0;
$name = "";
	foreach($replies as $r) {
		$count++;
		$clpse = "collapse in";
		if($r->staff == 0) {
			$cls = "panel-info";
			$clsa = "align-left";
		} else {
			$cls = "panel-success";
			$clsa = "align-right";
		}
		if($r->userid == 0) {
			$name = $ticket->name . " (". lang("pg_ticket_view_anon") .")";
		} else{
			$name = $r->name;
		}
		echo"<div class='panel $cls'>
				<div class='panel-heading $clsa' data-toggle='collapse' data-target='#message-id-{$r->ID}'><strong>".lang("pg_ticket_view_by")." {$name}</strong> @ ".date("m/d/Y H:i",$r->timestamp)."</div>
				  <div class='panel-body $clpse' id='message-id-{$r->ID}'>
				  ".nl2br($r->message);
				  if($r->attachments) {
				  	echo"<hr class='hr'>
				  	".lang("pg_ticket_view_file_warning") ."<br />";
				  	$attachments = $this->ticket_model->getAttachments($r->ID);
				  	foreach($attachments->result() as $a) {
				  		echo"<a href='".base_url()."{$this->settings->info->upload_path_relative}/{$a->file_name}' target='_blank'>{$a->file_name}</a> [{$a->IP}]<br />";
				  	}
				  }
				  echo"
				  </div>
			</div>";
	}
?>
</div></div></div>