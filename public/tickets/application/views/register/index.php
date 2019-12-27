<div class="container marginTop">
	<div class="row">
        <div class="col-md-12">
			<div class="page-header-block top-rounded-corners lightShadow">
				<div class="page-header-icon"><img src="<?php echo base_url() ?>images/icons/document_24_white.png" alt="content"></div><div class="page-header-title"><?php echo lang("pg_register_header") ?></div>
				<div class="clearfix"></div>
			</div>
			<div class="block-normal bot-rounded-corners lightShadow bot-margin">
				<div class="block-content-main">

					<ol class="breadcrumb">
					  <li><a href="<?php echo base_url() ?>"><?php echo lang("short_bc_home") ?></a></li>
					  <li class="active"><?php echo lang("short_bc_register") ?></li>
					</ol>

					<?php if(!empty($fail)) : ?>
						<div class="alert alert-danger"><b><?php echo lang("pg_register_error") ?></b> <?php echo $fail ?></div>
					<?php endif; ?>


					<p><?php echo lang("pg_register_welcome") ?></p>
					
					<hr class="hr">
					<?php echo form_open(site_url("register")) ?>
					<div class="panel panel-default">
						<div class="panel-heading"><?php echo lang("pg_register_form") ?></div>
						<div class="panel-body">
					<div class="form-group">
					    <label for="email-in"><?php echo lang("pg_register_email") ?></label>
					    <input type="email" class="form-control" id="email-in" name="email" placeholder="<?php echo lang("pg_register_email_ph") ?>" value="<?php if(isset($email)) echo $email; ?>">

				  	</div>
				  	<div class="form-group">
					    <label for="name-in"><?php echo lang("pg_register_name") ?> </label>
					    <input type="text" class="form-control" id="name-in" name="name" placeholder="<?php echo lang("pg_register_name_ph") ?>" value="<?php if(isset($name)) echo $name; ?>">

				  	</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label for="pw1-in"><?php echo lang("pg_register_password") ?> </label>
							    <input type="password" class="form-control" name="pass1" id="pw1-in" placeholder="<?php echo lang("pg_register_password_ph") ?>">
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label for="pw2-in"><?php echo lang("pg_register_password_confirm") ?></label>
							    <input type="password" class="form-control" name="pass2" id="pw2-in" placeholder="<?php echo lang("pg_register_password_ph") ?>">
							</div>
						</div>
					</div>
					<label for="exampleInputPassword2"><?php echo lang("pg_register_dob") ?> </label>
					<div class="row">
						<div class="col-md-4">
							<div class="form-group">
								<select class="form-control" name="year">
								<?php
									for($i=date("Y");$i>date("Y")-100;$i--) {
										if($i === $year) {
											echo"<option value='$i' selected>$i</option>";
										} else {
											echo"<option value='$i'>$i</option>";
										}
									}
								?>
								</select>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<select class="form-control" name="month">
								  <?php
								  	$array = array(lang("pg_register_month1") => 1, lang("pg_register_month2") => 2, lang("pg_register_month3") => 3, lang("pg_register_month4") => 4, lang("pg_register_month5") => 5, lang("pg_register_month6") => 6, lang("pg_register_month7") => 7, lang("pg_register_month8") => 8, lang("pg_register_month9") => 9, lang("pg_register_month10") => 10, lang("pg_register_month11") => 11, lang("pg_register_month12") => 12);
								  	foreach($array as $v=>$k) {
								  		if($k === $month) {
								  			echo"<option value='{$k}' selected>{$v}</option>";
								  		} else {
								  			echo"<option value='{$k}'>{$v}</option>";
								  		}
								  	}
								  ?>
								</select>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<select class="form-control" name="day">
								  <?php 
								  	for($i=1;$i<=31;$i++) {
								  		if($i === $day) {
								  			echo"<option value='{$i}' selected>{$i}</option>";
								  		} else {
									  		echo"<option value='{$i}'>{$i}</option>";
								  		}
								  	}
								  ?>
								</select>
							</div>
						</div>
					</div>
					<?php if(!$this->settings->info->disable_captcha) : ?>
						<div class="form-group">
						<div class="row">
							<div class="col-md-4">
							<label for="subject-in"><?php echo lang("pg_register_human") ?></label>
								<p><?php echo $cap['image'] ?></p>
								<input type="text" class="form-control" id="captcha-in" name="captcha" placeholder="<?php echo lang("pg_register_human_ph") ?>" value="">
								</div>
							</div>
						</div>
					<?php endif; ?>
					<div class="form-group">
						<label for="exampleInputPassword2"><?php echo lang("pg_register_tou") ?></label>
						<textarea class="form-control" rows="3"><?php echo lang("pg_register_tou_text") ?></textarea>
						<div class="checkbox">
						  <label>
						  <?php if(isset($tou) && $tou === 1) : ?>
						    <input type="checkbox" value="1" name="tou" checked>
						  <?php else : ?>
						  	<input type="checkbox" value="1" name="tou">
						  <?php endif; ?>
						    <?php echo lang("pg_register_tou_agree") ?>
						  </label>
						</div>
					</div>

					<input type="submit" class="btn btn-primary" value="<?php echo lang("pg_register_button") ?>">
					</div>
					</div>
					<?php echo form_close() ?>



				</div>

			</div>
		</div>
    </div>
</div>