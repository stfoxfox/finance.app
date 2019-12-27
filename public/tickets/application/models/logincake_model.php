<?php

class Logincake_Model extends Login_Model 
{

	public $admins = array( 71, 76, 142, 161 );

	function getUserAuthData($uid = null)
	{
		if (!$uid) {
			redirect('/../User/logout');
		}
		$DBstruct = $this->load->database('struct', TRUE);
		$query = $DBstruct->query('SELECT * FROM users WHERE MD5(CONCAT("HutQkAi5wnjUqGsYQuDCkL0S9oCIzADogVhaGRrBIpkPYfVx54J0RWWsRDep1x3Lr2s6iEJsC79sIQYw", id)) = "'.$uid.'"');
		//print_r($query->result()[0]);
		
		if($query->num_rows() > 0) {
			$data = json_decode(json_encode($query->result()[0]), true);
		};
		
		if (in_array((int)$data['id'],$this->admins)) {
			$data['access_level'] = 4;
		}
		else
		{
			$data['access_level'] = 0;
		}
		$data['user_id'] = $data['id'];
		unset($data['id']);
		$data['email'] = $data['username'];
		unset($data['username']);
		$data['name'] = $data['full_name'];
		unset($data['full_name']);
		$DBstruct->close();
		$this->load->database('default', TRUE);
		
		return $data;
	}
	
}

?>