<?php

class Install_Model extends CI_Model 
{

	public function checkIpIsBlocked($ip) 
	{
		$s = $this->db->where("IP", $ip)->get("ip_block");
		if ($s->num_rows() > 0) {
			return true;
		} else {
			return false;
		}
	}

	public function createAdmin($email, $password) 
	{
		$this->db->insert("users", 
			array(
				"email" => $email,
				"name" => "Admin", 
				"password" => $password, 
				"access_level" => 4, 
				"IP" => $_SERVER['REMOTE_ADDR']
			)
		);
	}

	public function updateSite($name, $email, $dir) 
	{
		$this->db->update("site_settings", 
			array(
				"site_name" => $name, 
				"support_email" => $email, 
				"upload_path" => $dir . "uploads"
			)
		);
	}

	public function checkAdmin() 
	{
		$s = $this->db->where("access_level", 4)->get("users");
		if ($s->num_rows() > 0) {
			return true;
		} else {
			return false;
		}
	}
}

?>
