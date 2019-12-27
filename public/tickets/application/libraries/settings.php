<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Settings 
{

	var $info=array();

	var $version = "1.8";

	public function __construct() 
	{
		$CI =& get_instance();
		$site = $CI->db->select("site_name, site_desc, site_logo, custom_css,
		ticket_rating, article_voting, guest_enable, file_enable, 
		upload_path, upload_path_relative, envato_api_key, envato_api_username,
		support_email, twitter_name, twitter_display_limit,
		twitter_consumer_key, twitter_consumer_secret, twitter_access_token,
		update_tweets, twitter_update, disable_captcha, disable_seo,
		twitter_access_secret, alert_support_staff, register, kb_login")->where("ID", 1)->get("site_settings");
		
		if($site->num_rows() == 0) {
			$CI->template->error(
				"You are missing the site settings database row."
			);
		} else {
			$this->info = $site->row();
		}
	}

}

?>
