<?php

class Login_Model extends CI_Model 
{

	public function getUser($email, $pass) 
	{
		return $this->db->select("ID")
		->where("email", $email)->where("password", $pass)->get("users");
	}

	public function getUserByEmail($email) 
	{
		return $this->db->select("ID,password,access_level")
		->where("email", $email)->get("users");
	}

	public function updateUserToken($userid, $token) 
	{
		$this->db->where("ID", $userid)
		->update("users", array("token" => $token));
	}

	public function addToResetLog($ip) 
	{
		$this->db->insert("reset_log", 
			array(
				"IP" => $ip, 
				"timestamp" => time()
			)
		);
	}

	public function getResetLog($ip) 
	{
		return $this->db->where("IP", $ip)->get("reset_log");
	}

	public function getUserEmail($email) 
	{
		return $this->db->where("email", $email)
		->select("ID, name")->get("users");
	}

	public function resetPW($userid, $token) 
	{
		$this->db->insert("password_reset", 
			array(
				"userid" => $userid, 
				"token" => $token, 
				"IP" => $_SERVER['REMOTE_ADDR'], 
				"timestamp" => time()
			)
		);
	}

	public function getResetUser($token, $userid) 
	{
		return $this->db->where("token", $token)
		->where("userid", $userid)->get("password_reset");
	}

	public function updatePassword($userid, $password) 
	{
		$this->db->where("ID", $userid)
		->update("users", array("password" => $password));
	}

	public function deleteReset($token) 
	{
		$this->db->where("token", $token)->delete("password_reset");
	}

}

?>