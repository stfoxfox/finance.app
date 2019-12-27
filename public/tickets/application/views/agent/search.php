<div class="container marginTop">
	<div class="row">
		<?php include("sidebar.php"); ?>
        <div class="col-md-9">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_agent_search_title") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo site_url("index") ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("sp_panel") ?>"><?php echo lang("short_bc_admin") ?></a></li>
					  <li><a href="<?php echo site_url("agent") ?>"><?php echo lang("short_bc_agentview") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_searchtickets") ?></li>
					</ol>

					<p><?php echo lang("pg_agent_search_text") ?></p>

					<?php echo form_open(site_url("agent/search")) ?>
					<?php $options = array(lang("pg_agent_search_option_1") => 0, lang("pg_agent_search_option_2") => 1, lang("pg_agent_search_option_3") => 2, lang("pg_agent_search_option_4") => 3); ?>
					<div class="form-group">
						<div class="row">
							<div class="col-md-6">
						    	<input type="text" class="form-control" id="search-in" name="search" placeholder="<?php echo lang("pg_agent_search_placeholder") ?>" value="<?php if(isset($search)) echo $search ?>" />
						    </div>
						    <div class="col-md-3">
						    	<select class="form-control" name="type">
						    		<?php
						    			foreach($options as $k=>$v) {
						    				if($v == $type) {
						    					echo"<option value='$v' selected>$k</option>";
						    				} else {
						    					echo"<option value='$v'>$k</option>";
						    				}
						    			}
						    		?>
						    	</select>
						    </div>
						    <div class="col-md-2">
						    	<input type="submit" class="btn btn-primary" value="<?php echo lang("pg_agent_search_button") ?>" />
						    </div>
						</div>
				  	</div>
				  	<?php echo form_close() ?>
				  	<?php if(!empty($search) && $tickets->num_rows() == 0) : ?>
				  		<?php echo lang("pg_agent_search_bad") ?>
				  	<?php endif; ?>
				  	<?php if($tickets->num_rows() > 0) : ?>
					  	<table width="100%">
							<tr class='table-header-small'><td class="col-md-5"><b><?php echo lang("pg_agent_header_subject") ?></b></td><td class="col-md-1"><b><?php echo lang("pg_agent_header_priority") ?></b></td><td class="col-md-2"><b><?php echo lang("pg_agent_header_category") ?></b></td><td class="col-md-1"><b><?php echo lang("pg_agent_header_status") ?></b></td><td class="col-md-3"><b><?php echo lang("pg_agent_header_lastreply") ?></b></td></tr>
							<?php
							$c=0;
								foreach($tickets->result() as $r) {
									if($r->status==0) {
										$statusmsg = "<span class='response-ticket'>".lang("ticket_status_awaiting")."</span>";
									} elseif($r->status == 1) {
										$statusmsg = "<span class='open-ticket'>".lang("ticket_status_responded")."</span>";
									} elseif($r->status == 2) {
										$statusmsg = "<span class='closed-ticket'>".lang("ticket_status_closed")."</span>";
									} else {
										$statusmsg = land("ticket_status_invalid");
									}

									if($r->priority == 0) {
								    	$priority = "<span class='priority-low'>".lang("ticket_priority_low")."</span>";
								    } elseif($r->priority == 1) {
								    	$priority = "<span class='priority-medium'>".lang("ticket_priority_medium")."</span>";
								    } elseif($r->priority == 2) {
								    	$priority = "<span class='priority-high'>".lang("ticket_priority_high")."</span>";
								    } elseif($r->priority == 3) {
								    	$priority = "<span class='priority-urgent'>".lang("ticket_priority_urgent")."</span>";
								    }

									if(empty($r->replyname)) $r->replyname = lang("ticket_creator");
									$datetime = date("m/d/Y H:i",$r->last_reply_timestamp);
									if($c==0){
										$cl="table-row-no";
										$c++;
									} else {
										$cl="table-row-other";
										$c=0;
									}
									echo"<tr class='table-row $cl'><td><a href='".site_url("tickets/view/" . $r->ID)."'>{$r->subject}</a></td><td>{$priority}</td><td>{$r->catname}</td><td>{$statusmsg}</td><td>{$r->replyname} ($r->replies)<br />$datetime</td></tr>";
								}
							?>
						</table>
					<?php endif; ?>

				</div>

			</div>
		</div>
    </div>
</div>