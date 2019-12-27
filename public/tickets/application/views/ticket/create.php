<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_ticket_create_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="/"><?php echo lang("short_bc_home") ?></a></li>
					  <li><a href="<?php echo site_url("tickets/index") ?>"><?php echo lang("short_bc_tickets") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_create_ticket") ?></li>
					</ol>

					<?php if(!empty($fail)) : ?>
						<div class="alert alert-danger"><b><?php echo lang("pg_ticket_error") ?></b> <?php echo $fail ?></div>
					<?php endif; ?>

					<?php if($this->user->loggedin === null || !$this->user->loggedin) : ?>
						<div class="alert alert-warning"><b><?php echo lang("pg_ticket_login") ?></div>
					<?php endif; ?>

					<br />
					<img src="<?php echo base_url() ?>images/icons/gear_48.png" class="floatLeft right-margin" alt="content" /><?php echo lang("pg_ticket_welcome") ?>
					 <div class="clearfix"></div>
					 <br /><br />
					 <?php echo form_open_multipart(site_url("tickets/create")) ?>
					<form>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_ticket_fill_out") ?></div>
						<div class="panel-body">
							
							<div class="form-group">
								<div class="row">
									<div class="col-md-6">
								    	<label for="email-in"><?php echo lang("pg_ticket_email") ?></label>
								    	<input type="email" class="form-control" id="email-in" name="email" placeholder="<?php echo lang("pg_ticket_email_ph") ?>" value="<?php if(isset($email)) echo $email; ?>">
								    </div>
								</div>
						  	</div>
						  	<div class="form-group">
							  	<div class="row">
									<div class="col-md-6">
								    	<label for="name-in"><?php echo lang("pg_ticket_name") ?> </label>
								    	<input type="text" class="form-control" id="name-in" name="name" placeholder="" value="<?php if(isset($name)) echo $name; ?>">
								    </div>
								</div>
						  	</div>
						  	<div class="row">
								<div class="col-md-4">
									<div class="form-group">
										<label for="prio-in"><?php echo lang("pg_ticket_priority") ?> </label>
										<select class="form-control" name="priority">
											<option value="0"><?php echo lang("ticket_priority_low") ?></option>
											<option value="1"><?php echo lang("ticket_priority_medium") ?></option>
											<option value="2"><?php echo lang("ticket_priority_high") ?></option>
											<option value="3"><?php echo lang("ticket_priority_urgent") ?></option>
										</select>
									</div>
								</div>

								<div class="col-md-4">
									<div class="form-group">
										<label for="cat-in"><?php echo lang("pg_ticket_category") ?></label>
										<select class="form-control" name="category">
											<?php 
												foreach($categories->result() as $r) {
													echo"<option value='{$r->ID}'>{$r->name}</option>";
												}
											?>
										</select>
									</div>
								</div>
							</div>

							<div class="form-group">
							    <label for="subject-in"><?php echo lang("pg_ticket_subject") ?> </label>
							    <input type="text" class="form-control" id="subject-in" name="subject" placeholder="" value="<?php if(isset($subject)) echo $subject; ?>">
						  	</div>

						  	<div class="form-group">
								<textarea class="form-control" rows="6" name="message"><?php if(isset($message)) echo $message; ?></textarea>
							</div>

							<?php 
								foreach($custom_fields->result() as $r) {
									if($r->type== 0) {
										$type = "text";
									} elseif($r->type == 1) {
										$type = "email";
									} elseif($r->type == 3) {
										//Envato key
										$type = "text";
									}
									echo"<div class='form-group'>
										<div class='row'>
										<div class='col-md-6'>
										<label for='custom-field-{$r->ID}'>{$r->name} ";
										if($r->required) echo"<span class='required full-rounded-corners'>REQUIRED</span>";
										echo"</label>";
										if($r->type == 2) {
											echo"<select class='form-control' name='custom-field-{$r->ID}' id='custom-field-{$r->ID}'>";
											$selectoptions = explode(",", $r->selectoptions);
											foreach($selectoptions as $op=>$v) {
												echo"<option value='$op'>{$v}</option>";
											}
											echo"</select>";
										} elseif($r->type == 4) {
											echo"<textarea class='form-control' rows='6' name='custom-field-{$r->ID}'></textarea>";
										} else {
											echo"
											<input type='{$type}' class='form-control' name='custom-field-{$r->ID}' id='custom-field-{$r->ID}' placeholder=\"{$r->placeholder}\" value=\"";
											$data = $this->input->post("custom-field-" . $r->ID, true);
											if(isset($_POST["custom-field-" . $r->ID])) echo $data;
											echo"\">";
										}
										if(!empty($r->subtext)) {
											echo"<span class='help-block'>{$r->subtext}</span>";
										}

										echo"
										</div>
										</div>
									</div>";
								}
							?>
							<?php if($this->settings->info->file_enable) : ?>
								<ul class="list-group" id="file_uploads">
	  								<li class="list-group-item"><input type="file" name="files[]" size="20" /></li>
	  							</ul>

	  							<p><button type="button" class="btn btn-primary btn-xs" onClick="addNewFile()"><?php echo lang("pg_ticket_add_file") ?></button></p>
	  						<?php endif; ?>
	  						<?php if(!$this->settings->info->disable_captcha) : ?>
	  							<div class="form-group">
									<div class="row">
										<div class="col-md-4">
										<label for="subject-in"><?php echo lang("pg_ticket_human") ?></label>
		  								<p><?php echo $cap['image'] ?></p>
		  								<input type="text" class="form-control" id="captcha-in" name="captcha" placeholder="<?php echo lang("pg_ticket_human_ph") ?>" value="">
		  								</div>
		  							</div>
	  							</div>
	  						<?php endif; ?>

  						<input type="submit" class="btn btn-primary" name="s" value="<?php echo lang("pg_ticket_button") ?>">

						</div>
					</div>

					

				  	<?php echo form_close() ?>
				</div>

			</div>
		</div>
    </div>
</div>