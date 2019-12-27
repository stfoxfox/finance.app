<?php

class Logink_Model extends Login_Model 
{

	
	public function getUserById($id) 
	{
		return $this->db->select("ID,password,access_level,email,name,konstr_user_id")
		->where("id", $id)->get("users");
	}
	
	public function getUserByEmail($email) 
	{
		return $this->db->select("ID,password,access_level,email,name,konstr_user_id")
		->where("email", $email)->get("users");
	}
	
	public function getUserByKonstrId($id) 
	{
		return $this->db->select("ID,password,access_level,email,name,konstr_user_id")
		->where("konstr_user_id", $id)->get("users");
	}
	
	
	function getValsFromArray($arrUser)
	{
		$result = array(
				'user_id'=>isset($arrUser['user_id']) ? (int)$arrUser['user_id'] : 0,
				'email'=>strtolower(isset($arrUser['email']) ? $arrUser['email'] : ''),
				'access_level'=>isset($arrUser['access_level']) ? (int)$arrUser['access_level'] : 0,
				'name'=>isset($arrUser['name']) ? $arrUser['name'] : ''
			     );
		
		if (!strlen($arrUser['name'])) {
			$tmp = explode('@',$result['email']);
			$result['name'] = $tmp[0];
		}
		
		return $result;
	}
	
	
	public function updateUserKonstrId($id,$arrUser)
	{
		
		$arrUser = $this->getValsFromArray($arrUser);
		
		$this->db->where("ID", $id)
		->update("users",
			array(
				"email" => $arrUser['email'],
				"name" => $arrUser['name'], 
				"IP" => $_SERVER['REMOTE_ADDR'],
			)
			 );
		
		return $this->getUserByEmail($arrUser['email']);
		
	}
	
	
	public function registerUserKonstrId($arrUser)
	{
		$arrUser = $this->getValsFromArray($arrUser);
		
		$id = $arrUser['user_id'];
		$email = $arrUser['email'];
		$name = $arrUser['name'];
		$accessLevel = $arrUser['access_level'];
			
		
		$login = $this->getUserByEmail($email);
		if ($login->num_rows() != 0) {
			return;
		}
		$this->db->insert("users", 
			array(
				"email" => $email,
				"name" => $name, 
				"password" => '###',
				"access_level" => $accessLevel, 
				"IP" => $_SERVER['REMOTE_ADDR'],
				"konstr_user_id" => $id
			)
		);
		
		return $this->getUserByEmail($arrUser['email']);
	}

	
}

?>