<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class User 
{

	var $info=array();
	var $loggedin=false;
	var $u=null;
	var $p=null;

	public function __construct() 
	{
		 $CI =& get_instance();
		 $this->u = $CI->input->cookie("scun", TRUE);
		 $this->p = $CI->input->cookie("sctkn", TRUE);

		 if ($this->u && $this->p) {
			 $user = $CI->db->select(
			 	" users.`ID`, users.`name`, users.`email`, users.`access_level`,
			 	 users.`default_ticket_category`, users.`email_notification`, 
			 	 users.`locked_category`"
			 )
			 ->where("email", $this->u)->where("token", $this->p)
			 ->get("users");

			 if ($user->num_rows() == 0) {
			 	$this->loggedin=false;
			 } else {
			 	$this->loggedin=true;
			 	$this->info = $user->row();
			 	if ($this->info->access_level == -1) {
			 		$CI->load->helper("cookie");
			 		$this->loggedin = false;
			 		$CI->session->set_flashdata("globalmsg", 
			 			"This account has been deactivated and can no longer be used.");
			 		delete_cookie("scun");
					delete_cookie("sctkn");
					redirect(base_url());
			 	} elseif($this->info->access_level == -2) {
			 		$CI->load->helper("cookie");
			 		$this->loggedin = false;
			 		$CI->session->set_flashdata("globalmsg",
			 		"This account has been BANNED and can no longer be used.");
			 		delete_cookie("scun");
					delete_cookie("sctkn");
					redirect(base_url());
			 	}
			 }
		}
	}

	public function getPassword() 
	{
		$CI =& get_instance();
		$user = $CI->db->select("users.`password`")
		->where("ID", $this->info->ID)->get("users");
		$user = $user->row();
		return $user->password;
	}

}

?>
