<!DOCTYPE html>
<html lang="en">
    <head>
        <title><?php echo $this->settings->info->site_name ?></title>         
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="shortcut icon" href="<?php echo base_url() ?>images/favicon.png" />
        <!-- Bootstrap -->
        <link href="<?php echo base_url();?>bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">

         <!-- Styles -->
        <link href="<?php echo base_url();?>styles/style.css" rel="stylesheet" type="text/css">
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,600,700' rel='stylesheet' type='text/css'>

        <!-- SCRIPTS -->
        <script type="text/javascript">
        var global_base_url = "<?php echo base_url() ?>";
        </script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script src="<?php echo base_url();?>bootstrap/js/bootstrap.min.js"></script>

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
          <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
        
        <!-- CODE INCLUDES -->
        <?php echo $cssincludes ?> 

        <!-- CUSTOM CSS -->
        <?php if(!empty($this->settings->info->custom_css)) : ?>
            <style type="text/css">
            <?php echo $this->settings->info->custom_css ?>
            </style>
        <?php endif; ?>
    </head>
    <body>
        <header class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="sc-navbar lightShadow">
                        <div class='main-drop'>

                        <select name='link' OnChange="window.location.href=$(this).val();">
                            <option value='<?php echo base_url() ?>'><?php echo lang("navigation_home") ?></option>
                            <option value='<?php echo site_url("aboutus") ?>'><?php echo lang("navigation_about") ?></option>
                            <?php if(!$this->user->loggedin) : ?>
                                <option value='<?php echo site_url("register") ?>'><?php echo lang("navigation_register") ?></option>
                                <option value='<?php echo site_url("login") ?>'><?php echo lang("navigation_login") ?></option>
                            <?php endif; ?>
                            <?php if($this->user->loggedin && $this->user->info->access_level > 1) : ?>
                                    <option value='<?php echo site_url("sp_panel") ?>'><?php echo lang("navigation_panel") ?></option>
                            <?php endif; ?>
                            <option value='<?php echo site_url("tickets") ?>'><?php echo lang("navigation_tickets") ?></option>
                            <option value='<?php echo site_url("tickets/create") ?>'><?php echo lang("navigation_create") ?></option>
                            <option value='<?php echo site_url("tickets/your") ?>'><?php echo lang("navigation_yourtickets") ?></option>
                            <option value='<?php echo site_url("tickets/anon") ?>'><?php echo lang("navigation_guesttickets") ?></option>
                                <?php  if($this->user->loggedin && $this->user->info->access_level > 0) : ?>
                                     <option value='<?php echo site_url("agent") ?>'><?php echo lang("navigation_agent") ?></option>
                                <?php endif; ?>
                            <option value='<?php echo site_url("article") ?>'><?php echo lang("navigation_knowledge") ?></option>
                             <?php if($this->user->loggedin) : ?>
                            <option value='<?php echo site_url("user_settings") ?>'><?php echo lang("navigation_settings") ?></option>
                            <option value='<?php echo site_url("user_settings/changepw") ?>'><?php echo lang("navigation_changepw") ?></option>
                            <?php endif; ?>
                        </select> 
                        </div>
                        <ul class='sc-nav'>
                            <li><img src='<?php echo base_url();?>images/icons/home_24.png' alt='home' class='nav-icon'><a href="<?php echo base_url() ?>">Home</a>
                                <ul>
                                <li><a href='<?php echo site_url("aboutus") ?>'><?php echo lang("navigation_about") ?></a></li>
                                <?php if(!$this->user->loggedin) : ?>
                                <li><a href='<?php echo site_url("register") ?>'><?php echo lang("navigation_register") ?></a></li>
                                <li><a href='<?php echo site_url("login") ?>'><?php echo lang("navigation_login") ?></a></li>
                                <?php endif; ?>
                                <?php if($this->user->loggedin && $this->user->info->access_level > 1) : ?>
                                    <li><a href='<?php echo site_url("sp_panel") ?>'><?php echo lang("navigation_panel") ?></a></li>
                                <?php endif; ?>
                                </ul></li>
                            <li><img src='<?php echo base_url();?>images/icons/man_24.png' alt='tickets' class='nav-icon'><a href="<?php echo site_url("tickets") ?>"><?php echo lang("navigation_tickets") ?></a>
                                <ul>
                                <li><a href='<?php echo site_url("tickets/create") ?>'><?php echo lang("navigation_create") ?></a></li>
                                <li><a href='<?php echo site_url("tickets/your") ?>'><?php echo lang("navigation_yourtickets") ?></a></li>
                                <li><a href='<?php echo site_url("tickets/anon") ?>'><?php echo lang("navigation_guesttickets") ?></a></li>
                                <?php  if($this->user->loggedin && $this->user->info->access_level > 0) : ?>
                                    <li><a href='<?php echo site_url("agent") ?>'><?php echo lang("navigation_agent") ?></a></li>   
                                <?php endif; ?>
                                </ul></li>
                            <li><img src='<?php echo base_url();?>images/icons/document_24.png' alt='article' class='nav-icon'><a href="<?php echo site_url("article") ?>"><?php echo lang("navigation_knowledge") ?></a></li>
                            <?php if($this->user->loggedin) : ?>
                            <li><img src='<?php echo base_url();?>images/icons/spanner_24.png' alt='user_settings' class='nav-icon'><a href="<?php echo site_url("user_settings") ?>"><?php echo lang("navigation_settings") ?></a>
                            <ul>
                            <li><a href='<?php echo site_url("user_settings/changepw") ?>'><?php echo lang("navigation_changepw") ?></a></li>
                            </ul>
                            </li>
                        	<?php endif; ?>
                            <?php if($this->user->loggedin) : ?>
                            <li class='sc-pill-small'><img src='<?php echo base_url();?>images/icons/arrow_down_24.png' alt='user info' class='nav-icon'>
                            <ul>
                            <li><?php echo $this->user->info->name ?></li>
                            <li><a href='<?php echo site_url("login/logout/" . $this->security->get_csrf_hash());?>'><?php echo lang("navigation_logout") ?></a></li>
                            </ul>
                            </li>
                            <?php endif;?>
                        </ul>
                        <?php echo form_open(site_url("article/search")) ?>
                        <div class='search-ui input-group'>
                        <input type='text' name='search' class='form-control no-right-border brownBorder' placeholder="<?php echo lang("navigation_search") ?>">
                        <span class="input-group-btn">
                            <button type="submit" class="btn btn-default brownBorder search-button" name="s"><?php echo lang("navigation_search_button") ?></button>
                        </span>
                        </div>
                        <?php echo form_close() ?>
                    </div>
                </div>
            </div>
        </header>

        <?php $gl = $this->session->flashdata('globalmsg'); ?>
        <?php if(!empty($gl)) :?>
                <div class="container marginTop">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="block-normal-noheight full-rounded-corners lightShadow">
                                <div class="alert alert-success"><b><?php echo lang("content_notice") ?></b> <?php echo $this->session->flashdata('globalmsg') ?></div>
                            </div>
                        </div>
                    </div>
                </div>
        <?php endif; ?>

        <?php echo $content ?>
        
    </body>
</html>
