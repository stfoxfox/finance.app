<div class="container marginTop">
    <div class="row">
        <div class="col-md-4 ">
            <div class="block-wrap">
                <div class="top-block-ticket lightShadow">
                    <div class="top-block-area-wrap">
                        <div class="top-block-area-icon"><img src='<?php echo base_url();?>images/icons/comment_64.png' alt='create a ticket'></div>
                        <div class="top-block-area-text">
                            <h5 class='block-header'><?php echo lang("front_ticket_box_title") ?></h5>
                            <p class='block-header-subtext'><?php echo lang("front_ticket_box_subtext") ?></p>
                        </div>
                    </div>                            
                </div>
                <?php echo form_open(site_url("tickets/create")) ?>
                <div class="block-normal lightShadow">
                    <div class="box-padding">
                        <p class="sans-big-text"><?php echo lang("front_ticket_box_name") ?></p>
                    <input type="text" name="tmp_name" class="form-control roundCorners"><br />
                    <p class="sans-big-text"><?php echo lang("front_ticket_box_email") ?></p>
                    <input type="text" name="tmp_email" class="form-control roundCorners"><br />

                    <p class="sans-big-text"><?php echo lang("front_ticket_box_message") ?></p>
                    <textarea class="form-control roundCorners" name="tmp_message" rows="3"></textarea>
                    </div>
                </div>
                <div class="bot-block-ticket lightShadow">
                    <div class="box-padding"> <input type="submit" name="tmp_ticket" class="btn btn-primary" value="<?php echo lang("front_ticket_box_button_create") ?>"></div>
                </div>
                <?php echo form_close() ?>
            </div>
        </div>
        <div class="col-md-4 ">
            <div class="block-wrap">
                <div class="knowledge-block-header top-rounded-corners lightShadow">
                    <ul class="knowledge-block-tabs">
                        <li id="new-tab"><img src='<?php echo base_url();?>images/icons/document_24.png' alt='knowledge newest' class='knowledge-block-tabs-icon'><?php echo lang("front_knowlesge_box_newest") ?></li>
                        <li class='faded' id='pop-tab'><img src='<?php echo base_url();?>images/icons/document_24.png' alt='knowledge popular' class='knowledge-block-tabs-icon'><?php echo lang("front_knowlesge_box_popular") ?></li>
                    </ul>
                    <div class='clearfix'></div>
                </div>
                <div class="block-normal lightShadow">
                    <div id="article-loader"><img src="<?php echo base_url() ?>images/ajax-loader.gif" alt='results' /></div>
                    <div id="articles-b">
                    <?php
                        foreach($articles->result() as $r) {
                            $content = strip_tags($r->content);
                            $content = substr($content, 0, 75);
                            $content = $content . " ...";
                        
                            $artname =  $r->title;
                            $artname = trim($artname);
                            $artname = strtolower(str_replace(" ", "-", $artname));

                            $r->name = strtolower(str_replace(" ", "-", $r->name));

                            if($this->settings->info->disable_seo) {
                                $url = site_url("article/view/" .$r->ID);
                            } else {
                                $url = site_url("article/view/" .$r->name . "/" . $artname);
                            }
                    
                            echo"<div class='knowledge-article-block animate'>
                            <p><b>{$r->title}</b></p>
                            <p>{$content}</p>
                            <p><a href='".$url."'>". lang("front_knowledge_box_read_link") ."</a></p>
                            </div>";
                        }
                    ?>
                    </div>
                </div>
                <div class="knowledge-bottom-block bot-rounded-corners lightShadow">
                    <p><img src='<?php echo base_url();?>images/icons/document_24_white.png' alt='knowledge base' class='knowledge-block-tabs-icon'><?php echo lang("front_knowledge_box_title") ?></p>
                </div>
            </div>

            <div class="block-wrap top-margin">
                <div class="about-header-block top-rounded-corners lightShadow">
                     <div class="twitter-block-icon"><img src="<?php echo base_url();?>images/icons/home_64.png" alt="home"></div><div class="twitter-block-text"><h5 class="block-header"><?php echo lang("front_site_box_title") ?></h5><p class="block-header-subtext"><?php echo lang("front_site_box_subtext") ?></p></div>
                    <div class="clearfix"></div>
                </div>
                 <div class="block-normal lightShadow">
                    <div class="box-padding align-center">
                    <?php if(!empty($this->settings->info->site_logo)) : ?>
                    <p><img src='<?php echo base_url().$this->settings->info->upload_path_relative . "/" . $this->settings->info->site_logo ?>' alt='site logo'></p>
                    <?php endif; ?>
                    <p><?php echo $this->settings->info->site_desc ?></p>
                    </div>
                </div>
                 <div class="lightShadow twitter-bottom bot-rounded-corners"></div>
            </div>
        </div>

        <div class="col-md-4 ">
            <div class="block-wrap">
                <div class="login-block-header top-rounded-corners lightShadow">
                    <div class="login-block-icon"><img src="<?php echo base_url();?>images/icons/gear_48_white.png" alt='login'></div><div class="login-block-text"><h5 class="block-header"><?php echo lang("front_login_box_title") ?></h5><p class="block-header-subtext"><?php echo lang("front_login_box_subtext") ?></p></div>
                    <div class="clearfix"></div>
                </div>
                <?php echo form_open(site_url("login/pro")) ?>
                <div class="block-normal bot-rounded-corners lightShadow">
                    <div class="box-padding">
                    <?php if($this->user->loggedin === null || !$this->user->loggedin) : ?>
                        <p class="sans-big-text"><?php echo lang("front_login_box_email") ?></p>
                        <div class="input-group">
                          <span class="input-group-addon">@</span>
                          <input type="text" name="email" class="form-control">
                        </div><br />

                        <p class="sans-big-text"><?php echo lang("front_login_box_password") ?></p>
                        <div class="input-group">
                          <span class="input-group-addon"><span class="glyphicon glyphicon-hand-right"></span></span>
                          <input type="password" name="pass" class="form-control">
                        </div><br />

                         <div class="box-padding"> <input type="checkbox" name="remember" value="1"> <?php echo lang("front_login_box_remember") ?> <input type="submit" class="btn btn-primary floatRight purpleButton" value="<?php echo lang("front_login_box_button_login") ?>"></div>
                    <?php else : ?>
                        <?php echo lang("front_login_box_loggedin_as") ?> <b><?php echo $this->user->info->email ?></b><br /><br />
                        <a href="<?php echo site_url("user_settings") ?>"><?php echo lang("front_login_box_update_link") ?></a>
                    <?php endif; ?>
                    </div>
                </div>
                <?php echo form_close() ?>
            </div>

            <div class="block-wrap top-margin">
                <div class="twitter-header-block top-rounded-corners lightShadow">
                     <div class="twitter-block-icon"><img src="<?php echo base_url();?>images/icons/twitter_icon.png" alt='twitter'></div><div class="twitter-block-text"><h5 class="block-header"><?php echo lang("front_twitter_box_title") ?></h5><p class="block-header-subtext"><?php echo lang("front_twitter_box_subtext") ?></p></div>
                    <div class="clearfix"></div>
                </div>
                 <div class="block-normal lightShadow">
                    <div id="loader"><img src="<?php echo base_url() ?>images/ajax-loader.gif" alt='results' /></div>
                    <div id="tweets">
                    </div>
                 </div>
                 <div class="lightShadow twitter-bottom bot-rounded-corners bot-margin"></div>
            </div>
        </div>
    </div>
</div>