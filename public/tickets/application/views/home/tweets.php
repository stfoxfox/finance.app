<?php if( !empty( $tweets) AND empty( $tweets->errors ) ) : ?>
    <?php $twitter = current($tweets); ?>
<?php foreach( $tweets as $tweet ) : ?>
    <?php if(is_object($tweet)) : ?>

    <?php 
     
        if( (strtotime($tweet->timestamp)+3600*24) > time() ) {
            $date = "Less than a day ago";
        } elseif( (strtotime($tweet->timestamp)+3600*48) > time() ) {
            $date = "One day ago";
        } elseif ( (strtotime($tweet->timestamp)+3600*48) > time() ) {
            $date = "Two days ago";
        } else {
            $date = date("m-d-Y",strtotime($tweet->timestamp));
        }
        $text = $tweet->tweet;
        $text = preg_replace( '/http:\/\/([a-z0-9_\.\-\+\&\!\#\~\/\,]+)/i', "<a href='http://$1'>http://$1</a>", $tweet->tweet );
    ?>
    <div class='tweet-block'>
        <div class='tweet-icon-b'><img src='<?php echo base_url();?>images/icons/tweet_icon.png'></div><div class='tweet-info'><b><?php echo $twitter->name ?></b> @<?php echo $twitter->username ?><br /><?php echo $text ?></div>
        <div class='clearfix'></div>
        <div class='tweet-when'><?php echo $date ?></div>
        <div class='clearfix'></div>
    </div> 
    <?php endif; ?>
<?php endforeach; ?>

<?php endif; ?>