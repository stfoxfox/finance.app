<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Template
{

	var $cssincludes;

	public function loadContent($view,$data=array(),$die=0)
	{
		$CI =& get_instance();
		$site = array();
		$site['cssincludes'] = $this->cssincludes;
		$site['content'] = $CI->load->view($view,$data,true);
		$CI->load->view("layout/layout.php", $site);
		if($die) die($CI->output->get_output());
	}

	public function loadAjax($view,$data=array(),$die=0) 
	{
		$CI =& get_instance();
		$site = array();
		$site['cssincludes'] = $this->cssincludes;
		$CI->load->view($view,$data);
		if($die) die($CI->output->get_output());
	}

	public function loadExternal($code) 
	{
		$this->cssincludes = $code;
	}

	public function error($message) 
	{
		$this->loadContent("error/error.php",array("message" => $message),1);
	}

	public function errori($msg) 
	{
		echo "ERROR: " . $msg;
		exit();
	}

}

?>
