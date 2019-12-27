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
        <p><a href='".$url."'>"
        .lang("front_knowledge_box_read_link")."</a></p>
        </div>";
    }
?>