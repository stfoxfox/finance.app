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
	
	<link href="<?php echo base_url();?>styles/konstruktor.css" rel="stylesheet" type="text/css">

        <!-- CUSTOM CSS -->
        <?php if(!empty($this->settings->info->custom_css)) : ?>
            <style type="text/css">
            <?php echo $this->settings->info->custom_css ?>
            </style>
        <?php endif; ?>
    </head>
    <body>


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
