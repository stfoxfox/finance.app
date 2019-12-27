<script type="text/javascript">
<?php if($this->user->loggedin) : ?>
var admin_user = "<?php echo $this->user->info->name ?>";
<?php else : ?>
var admin_user = "no one";
<?php endif; ?>
var ticket_user = "<?php echo $ticket->name ?>";
</script>
<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_ticket_your_tickets_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

				<?php if($this->user->loggedin && $this->user->info->access_level > 0) : ?>
					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("sp_panel") ?>"><?php echo lang("short_bc_admin") ?></a></li>
					  <li><a href="<?php echo site_url("agent") ?>"><?php echo lang("short_bc_viewtickets") ?></a></li>
					 <li class="active"><?php echo lang("short_bc_viewing_ticket") ?></li>
					</ol>

				<?php else : ?>
					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("tickets") ?>"><?php echo lang("short_bc_tickets") ?></a></li>
					  <li><a href="<?php echo site_url("tickets/your") ?>"><?php echo lang("short_bc_your_tickets") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_viewing_ticket") ?></li>
					</ol>

				<?php endif; ?>


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
									<div class="btn-group">
									  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
									    <?php echo lang("pg_ticket_view_ticket_action") ?> <span class="caret"></span>
									  </button>
									  <ul class="dropdown-menu" role="menu">
									    <li><a href="<?php echo site_url("tickets/close/" . $ticket->ID . "/" . $this->security->get_csrf_hash() ) ?>"><?php echo lang("pg_ticket_action1") ?></a></li>
									    <li><a href="<?php echo site_url("tickets/priority/" . $ticket->ID . "/1/" . $this->security->get_csrf_hash() ) ?>"><?php echo lang("pg_ticket_action2") ?></a></li>
									    <li><a href="<?php echo site_url("tickets/priority/" . $ticket->ID . "/2/" . $this->security->get_csrf_hash() ) ?>"><?php echo lang("pg_ticket_action3") ?></a></li>
									    <li><a href="<?php echo site_url("tickets/pprint/" . $ticket->ID ) ?>"><?php echo lang("pg_ticket_print_link") ?></a></li>
									  </ul>
									</div>

									<?php if($this->user->loggedin && $this->user->info->access_level > 0) : ?>
										<div class="btn-group">
										  <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown">
										    <?php echo lang("pg_ctn_2") ?> <span class="caret"></span>
										  </button>
										  <ul class="dropdown-menu" role="menu">
										    <li><a href="javascript:void(0)" onclick="showNotes()"><?php echo lang("short_bc_admin_notes") ?></a></li>
										    <li><a href="<?php echo site_url("tickets/assign/" . $ticket->ID ) ?>"><?php echo lang("pg_ctn_3") ?></a></li>
										  </ul>
										</div>
									<?php endif; ?>

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

					<div class="align-center decent-margin"><?php echo $this->pagination->create_links(); ?></div>

					<?php
					$count =0;
					$name = "";
						foreach($replies as $r) {
							$clpse = "collapse";
							$count++;
							if($count > ($reply_count-2)) {
								$clpse = "collapse in";
							}
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
							$edit_link = "";
							if($this->user->loggedin) {
								if($r->userid == $this->user->info->ID) {
									$edit_link = "<a href='".site_url("tickets/edit_ticket/" . $r->ID)."'>".lang("pg_ctn_1")."</a>";
								}
								if($this->user->info->access_level > 0) {
									$edit_link = "<a href='".site_url("tickets/edit_ticket/" . $r->ID)."'>".lang("pg_ctn_1")."</a>";
								}
							} else {
								if($r->staff == 0) {
									$edit_link = "<a href='".site_url("tickets/edit_ticket/" . $r->ID)."'>".lang("pg_ctn_1")."</a>";
								}
							}
							echo"<div class='panel $cls'>
									<div class='panel-heading $clsa' data-toggle='collapse' data-target='#message-id-{$r->ID}'><strong>".lang("pg_ticket_view_by")." {$name}</strong> @ ".date("m/d/Y H:i",$r->timestamp)." " . $edit_link . "</div>
									  <div class='panel-body $clpse' id='message-id-{$r->ID}'>
									  ".($r->message);
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

					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_ticket_view_reply") ?></div>
						<div class="panel-body align-center">
						<?php if($ticket->status != 2) : ?>
						<?php echo form_open_multipart(site_url("tickets/reply/" . $ticket->ID)) ?>
							<div class="form-group">
								<textarea class="form-control" rows="6" name="message" id="replyBox"></textarea>
							</div>
							<?php if($this->user->loggedin && $this->user->info->access_level > 0) : ?>
								<ul class="list-group" id="canned">
		  								<li class="list-group-item">
		  								<div class="row">
		  									<div class="col-md-2"><?php echo lang("pg_ticket_canned_response") ?></div>
		  									<div class="col-md-6"> 
		  									<select class="form-control" id="cannedRes">
		  										<?php foreach($responses->result() as $res) : ?>
		  											<option value="<?php echo $res->ID ?>"><?php echo $res->title ?></option>
		  										<?php endforeach; ?>
		  									</select>
		  									<?php foreach($responses->result() as $res) : ?>
		  										<div id="cannedResText-<?php echo $res->ID ?>" class="hidden" style="display: none;"><?php echo $res->response ?></div>
		  									<?php endforeach; ?>
		  									</div>
		  									<div class="col-md-2"> <input type="button" value="Use" class="btn btn-primary" onclick="load_canned()" />
		  									</div>
		  									</div></li>
		  						</ul>
		  					<?php endif; ?>
							<?php if($this->settings->info->file_enable) : ?>
								<ul class="list-group" id="file_uploads">
	  								<li class="list-group-item"><input type="file" name="files[]" size="20" /></li>
	  							</ul>

	  							<p class='align-left'><button type="button" class="btn btn-primary btn-xs" onClick="addNewFile()"><?php echo lang("pg_ticket_add_file") ?></button></p>
	  						<?php endif; ?>


  							<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_ticket_view_button_reply") ?>">
  						<?php echo form_close() ?>
						<?php else : ?>
							<img src="<?php echo base_url() ?>/images/icons/lock_64.png" alt="locked" /><br />
							<b><?php echo lang("pg_ticket_view_locked") ?></b> <br />
							<?php if($this->user->loggedin && $ticket->close_user != $this->user->info->ID) {
								echo lang("pg_ticket_view_locked_staff");
							} elseif($ticket->close_user > 0) {
								echo lang("pg_ticket_view_locked_staff");
							} else {
								echo lang("pg_ticket_view_locked_client");
							}
							?>
							<?php if($this->settings->info->ticket_rating && ($this->user->loggedin) && $ticket->userid > 0) : ?>
								<?php if($ratingFlag) : ?>
									<?php
									if($rating->rating == 1) {
										$ratingMessage = lang("pg_ticket_view_rate1");
									} elseif($rating->rating == 2) {
										$ratingMessage = lang("pg_ticket_view_rate2");
									} elseif($rating->rating == 3) {
										$ratingMessage = lang("pg_ticket_view_rate3");
									} elseif($rating->rating == 4) {
										$ratingMessage = lang("pg_ticket_view_rate4");
									} elseif($rating->rating == 5) {
										$ratingMessage = lang("pg_ticket_view_rate5");
									}
									?>
									<p><?php echo lang("pg_ticket_view_rated") ?> "<b><?php echo $ratingMessage ?></b>"</p>
								<?php else: ?>
									<?php echo lang("pg_ticket_view_rate_plz") ?><br />
									<div class="col-md-4 col-md-offset-4"><?php echo form_open(site_url("tickets/rating/" . $ticket->ID)) ?>
										<select name="rate" class="form-control"><option value="1"><?php echo lang("pg_ticket_view_rate1"); ?></option>
										<option value="2"><?php echo lang("pg_ticket_view_rate2"); ?></option>
										<option value="3"><?php echo lang("pg_ticket_view_rate3"); ?></option>
										<option value="4"><?php echo lang("pg_ticket_view_rate4"); ?></option>
										<option value="5"><?php echo lang("pg_ticket_view_rate5"); ?></option>
										</select>
									 <input type="submit" name="s" value="<?php echo lang("pg_ticket_view_button_rate") ?>" class="btn btn-default" /> </div>
									<?php echo form_close() ?>
								<?php endif; ?>
							<?php endif; ?>
						<?php endif; ?>
						</div>
					</div>

				</div>

			</div>
		</div>
    </div>
</div>