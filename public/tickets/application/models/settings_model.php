<?php

class Settings_Model extends CI_Model 
{

	public function checkPassword($pass, $userid) 
	{
		$s = $this->db->where("ID", $userid)->select("password")->get("users");
		if($s->num_rows() == 0) return false;
		$r =$s->row();
		if($r->password != $pass) return false;
		return true;
	}

	public function updateUser($userid, $email, $name, $email_notifications) 
	{
		$this->db->where("ID", $userid)->update("users", 
			array(
				"name" => $name, 
				"email" => $email, 
				"email_notification" => $email_notifications
			)
		);
	}

	public function updatePassword($userid, $pass) 
	{
		$this->db->where("ID", $userid)->update("users", 
			array(
				"password" => $pass
			)
		);
	}

	public function getPassword($userid) 
	{
		return $this->db->select("password")->where("ID", $userid)
		->get("users")->row()->password;
	}
}

?>
