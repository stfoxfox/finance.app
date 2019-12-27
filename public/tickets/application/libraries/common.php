<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

require_once("PasswordHash.php");

class Common 
{

	public function encrypt($password) 
    {
        $phpass = new PasswordHash(12, false);
        $hash = $phpass->HashPassword($password);
    	return $hash;
    }

    public function randomPassword() 
    {
    	$letters = array(
            "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
        );
    	$pass = "";
    	for($i=0;$i<10;$i++) {
    		shuffle($letters);
    		$letter = $letters[0];
    		if(rand(1,2) == 1) {
	    		$pass .= $letter;
    		} else {
	    		$pass .= strtoupper($letter);
    		}
    		if(rand(1,3)==1) {
    			$pass .= rand(1,9);
    		}
    	}
    	return $pass;
    }

    public function getAccessLevel($level) 
    {
        if($level == 0) {
            return "Member";
        } elseif($level == 1) {
            return "Support Agent";
        } elseif($level == 2) {
            return "Support Agent & Knowledge Base Editor";
        } elseif($level == 3) {
            return "Support Admin Assistant";
        } elseif($level == 4) {
            return "Support Admin";
        } elseif($level == -1) {
            return "Deactivated";
        } elseif($level == -2) {
            return "Banned";
        }
    }

    public function checkAccess($level, $required) 
    {
        $CI =& get_instance();
        if($level < $required) {
            $CI->template->error(
                "You do not have the required access to use this page. 
                You must be a ". $this->getAccessLevel($required)
                . "to use this page."
            );
        }
    }

}

?>
