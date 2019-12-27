<?php

class Register_Model extends CI_Model 
{

	public function registerUser($email, $name, $password, $dob,
	$accesslevel=0, $image="", $catid=0, $locked_cat=0
	) {
		$this->db->insert("users", 
			array(
				"email" => $email, 
				"name" => $name, 
				"password" => $password, 
				"dob" => $dob, 
				"access_level" => $accesslevel, 
				"IP" => $_SERVER['REMOTE_ADDR'], 
				"bio_pic" => $image, 
				"default_ticket_category" => $catid,
				"locked_category" => $locked_cat
			)
		);
	}

	public function checkEmailIsFree($email) 
	{
		$s=$this->db->where("email", $email)->get("users");
		if ($s->num_rows() > 0) {
			return false;
		} else {
			return true;
		}
	}

}

?>
