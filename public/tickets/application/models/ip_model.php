<?php

class IP_Model extends CI_Model 
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
}

?>
